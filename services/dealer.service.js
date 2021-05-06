const { models, transaction } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const Sequelize = require('sequelize');
const moment = require('moment');
const config = require('../configs/config');
const { Op } = Sequelize;

module.exports = {

    getUserDealer: async (id) => {
        let filter = id;
        if (typeof filter !== 'object') {
            filter = {id:id};
        }
        let result = await models.user.findOne({where: filter, include:[
            { model: models.dealer, include:[
                    {model: models.activity},
                    {model: models.position_activity},
                    {model: models.phone_numbers},
                ]
            },
            { model: models.region_activity}
                ] });

        result = result.toJSON();
        if(result && result.dealer && result.dealer.phone_numbers && result.dealer.phone_numbers.length) {
            result.dealer.phone_numbers.map(i => {
                if(i.icon) {
                    i.icon = JSON.parse(i.icon)
                }
            });
            result.dealer.main_phone_number = result.dealer.phone_numbers.shift();
            result.dealer.phone_numbers_length = result.dealer.phone_numbers.length;
        }
        return result;
    },

    getSrManagerNameById: async (id) => {
        let name = await models.user.findOne({
            where: { type: config.SR_MANAGER_ROLE },
            attributes:[ [sequelize.fn('CONCAT', sequelize.col('first_name'), " ", sequelize.col('last_name')),'name' ], 'email', 'phone', 'first_name', 'last_name' ],
            include: { model: models.manager_sr, where: {id:id}, attributes:[], required: true  }
        });
        name =name.toJSON();
        return {name: name.name, contact: name };
    },

    getDealerNameById: async (id) => {
        let name = await models.user.findOne({
            where: { type: config.DEALER_ROLE },
            attributes:[ [sequelize.fn('CONCAT', sequelize.col('first_name'), " ", sequelize.col('last_name')),'name' ] ],
            include: { model: models.dealer, where: {id:id}, attributes:["company_name"], required: true  }
        });
        // name = JSON.parse(JSON.stringify(name));
        return name.toJSON();
    },

    getAllSrManagers: async() => {
            let managers = await models.user.findAll({
                where: { type: config.SR_MANAGER_ROLE },
                attributes:[ [sequelize.fn('CONCAT', sequelize.col('first_name'), " ", sequelize.col('last_name')),'name' ] ],
                include: { model: models.manager_sr, attributes:['id'], required: true }
            });
            // JSON.parse(JSON.stringify(managers));
            return managers.map(function(item) {
                return item.toJSON();
            })
    },

    updateUserDealer: async(id, dealerId, userData, dealerData, phoneData) => {
        let transaction;
        try {

            transaction = await sequelize.transaction();

            await models.user.update(userData , {where: {id:id}, transaction});
            await models.dealer.update(dealerData , {where: {user_id:id}, transaction});

            await models.phone_numbers.destroy({where: {dealer_id: dealerId}, transaction});

            if(phoneData && phoneData.length) {
                await models.phone_numbers.bulkCreate(phoneData, {transaction});
            }

            await transaction.commit();

            return true

        }catch (e) {
            if (transaction) await transaction.rollback();
            throw e
        }
    },

    updateUser: async(id, userData) => {
        let result = await models.user.update(userData , {where: {id:id}});
        return  true
    },

    getAllRegions: async() => {
        let regions = await models.region_activity.findAll({attributes:['id','region']});

        return  regions.map(function(item) {
         return item.toJSON();
     })
    },

    getDealerByRegionId: async(regionId) => {
        let dealer = await models.user.findAll({
            where: {
                region_activity_id: regionId,
                type: config.DEALER_ROLE,
                status: config.GLOBAL_STATUSES.ACTIVE
            },
            include:[{ model: models.dealer, attributes:['id', 'company_name'], required: true }],
            attributes:['id','first_name','last_name']
        });
        // JSON.parse(JSON.stringify(dealer));
        return  dealer.map(function(item) {
            return item.toJSON();
        })
    },

    getAllActivity: async(filter) => {
        let activities = await models.activity.findAll({where: filter});
    //    JSON.parse(JSON.stringify(activities));
        return activities.map(function(item) {
            return item.toJSON();
        })
    },

    getAllPositionActivity: async() => {
        let activities = await models.position_activity.findAll();
    //    JSON.parse(JSON.stringify(activities));
        return activities.map(function(item) {
            return item.toJSON();
        })
    },

    getAllClients: async (data, blum) => {
        const perPage = data && data.perPage ? data.perPage : 2;
        const page = data && data.page ? data.page : 1;
        const offset = perPage * (page - 1);
        const limit = perPage;
        const order = [['createdAt', 'DESC']];


        let filter = [];
        if (data && data.search) {
            let searchField = data.search.trim().split(" ");
            if (searchField && searchField.length) {
                let like = [];
                searchField.forEach((item) => {
                    like.push({ [Op.like]: `%${item}%` });
                });
                filter.push({ [Op.or]: [ { first_name: { [Op.or]: like } }, { last_name: { [Op.or]: like } }] });
            }
        }
        if (data && data.status) {
            filter.push({ status: data.status});
        }
        if (data && data.company_name && data.company_name.length) {
            let arr = [];
            data.company_name.forEach(i => {
                arr.push({ '$client.company_name$': i});
            });
            filter.push({ [Op.or]: arr });
        }
        if(data && data.daterange){
            let daterange = data.daterange.split('-');
            let date = {};
            if (daterange[0]) date[Op.gte] = moment(daterange[0].trim(), "DD.MM.YYYY").toDate().toISOString();
            if (daterange[1]) date[Op.lte] = moment(daterange[1].trim(), "DD.MM.YYYY").endOf('day').toDate().toISOString();

            filter.push({ createdAt: date });
        }
        if (data && data.region) {
            filter.push({  '$client.dealer.user.region_activity_id$': data.region});
        }

        let clientFilter = {dealer_id: {[Op.in]: data.dealer_ids}};
        if (data && data.dealer) {
            clientFilter = {dealer_id: {[Op.in]: [data.dealer]}};
        }else if(blum){
            clientFilter = {}
        }

        filter = {[Op.and]:[ {type: config.CLIENT_ROLE}, {status: {[Op.ne]: '0'}}, {email_verified: 1},  ...filter ]};

        let needDealer = [];
        if(data.needDealer){
            if(data.needDealer === 'dealer'){
                needDealer = [{ model: models.dealer, attributes:['company_name']}]
            }
            else if(data.needDealer === 'dealer-user'){
                needDealer = [{ model: models.dealer, attributes:['company_name'], include:[
                        { model: models.user, attributes:['first_name', 'last_name']}]
                }]
            }
            else if(data.needDealer === 'dealer-user-region'){
                needDealer = [{ model: models.dealer, attributes:['company_name'], include:[
                        { model: models.user, attributes:['first_name', 'last_name'], include:[
                                { model: models.region_activity, attributes:['region']}
                            ]
                        }]
                }]
            }
        }

        let clients = await models.user.findAndCountAll({
            where: filter,
            include:[
                { model: models.client, where: clientFilter, required: true,
                    include: needDealer },
                { model: models.region_activity, required: false}
                ],
            offset:offset,
            limit:limit,
            order:order,
            distinct:true
        });
        clients.rows =  clients.rows.map(function(item) {
            return item.toJSON();
        })

        const countPages = Math.ceil(clients.count / perPage);

        return clients.count > 0 || clients.rows.length ? { clients:clients.rows, countItems:clients.count, countPages:countPages} : { clients:[], count:0, countItems:clients.count, countPages:countPages };
    },

    getClientDetail: async (user_id) => {
        let filter = user_id;
        if (typeof filter !== 'object') {
            filter = {id:user_id};
        }

        let client = await models.user.findOne({
            where: filter,
            include:[
                { model: models.client, include:[
                        {model: models.dealer, attributes: ['company_name','company_url']},
                        {model: models.activity},
                        {model: models.position_activity}

                    ]},
                { model: models.region_activity, required: false}],

        });
        // client = JSON.parse(JSON.stringify(client));

        return client.toJSON();
    },

    getAllDealers: async() => {
        let dealers = await models.user.findAll({
            where: { type: config.DEALER_ROLE },
            attributes:[ 'first_name', 'last_name'],
            include: { model: models.dealer, attributes:['id'], required: true }
        });
        // JSON.parse(JSON.stringify(dealers));
        return  dealers.map(function(item) {
            return item.toJSON();
        });
    },

    getDealerUser: async (id) => {
        let result = await models.dealer.findOne({
            where: {id:id},
            include: [
                { model: models.user, include:[
                        { model: models.region_activity}
                    ]
                },
                { model: models.phone_numbers}
            ]
        });
        if(result && result.phone_numbers && result.phone_numbers.length) {
            result = result.toJSON();
            result.main_phone_number = result.phone_numbers.shift();
        }
        return  result;
    },

    updateClientDetailEdit: async(id, userData, clientData) => {
        let transaction;
        try {

            transaction = await sequelize.transaction();

            let result = await models.user.update(userData , {where: {id: id}, transaction});
            result.client = await models.client.update(clientData , {where: {user_id: id}, transaction});

            await transaction.commit();

            return  true

        }catch (e) {
            if (transaction) await transaction.rollback();
            throw e
        }
    },

    getClientHistory: async(id, dealer_id) => {
        let filter = { user_id: id };
        if(dealer_id) filter.dealer_id = dealer_id;

        let history = await models.booking.findAll({
            where: filter,
            include: [{ model: models.address}]
        });
        let user = await models.user.findOne({
            where: {id:id},
            attributes: ['id','first_name', 'last_name', 'status']
        });
        history = history.map(function(item) {
            return item.toJSON();
        });
        user = user ? user.toJSON() : user;
        let result = {history: history, user: user};

        return result
    },

    changeUserStatus: async(id, status) => {
        let result = await models.user.update({status,updatedAt:Math.floor(new Date().getTime() / 1000) }, {where: {id:id}});
        // result = JSON.parse(JSON.stringify(result));
        return  result.map(function(item) {
            return item.toJSON();
        })
    },

    getAllOrdersForDealer: async (data, blum) => {
        const perPage = data && data.perPage ? data.perPage : 4;
        const page = data && data.page ? data.page : 1;
        const offset = perPage * (page - 1);
        const limit = perPage;
        const order = [['date', 'DESC']];

        let filter = [];
        if (data && data.search) {
            if (data && data.search) {
                let searchField = data.search.trim().split(" ");
                if (searchField && searchField.length) {
                    let like = [];
                    searchField.forEach((item) => {
                        like.push({ [Op.like]: `%${item}%` });
                    });
                    filter.push({ [Op.or]: [ { '$address.first_name$': { [Op.or]: like } }, { '$address.last_name$': { [Op.or]: like } }, { id: { [Op.or]: like } }] });
                }
            }
        }
        if (data && data.status) {
            filter.push({ status: data.status});
        }
        if (data && data.company_name && data.company_name.length) {
            let companyIds = await models.client.findAll({where: {company_name: {[Op.in]: data.company_name}}, attributes:['user_id']});
            // companyIds = JSON.parse(JSON.stringify(companyIds));
            filter.push({ [Op.or]: companyIds});
        }
        if(data && data.daterange){
            let daterange = data.daterange.split('-');
            let date = {};
            if (daterange[0]) date[Op.gte] = moment(daterange[0].trim(), "DD.MM.YYYY").toDate().toISOString();
            if (daterange[1]) date[Op.lte] = moment(daterange[1].trim(), "DD.MM.YYYY").endOf('day').toDate().toISOString();

            filter.push({ date: date });
        }

        if (data && data.dealer) {
            filter.push({ '$dealer.id$': data.dealer});
        }
        if (data && data.region) {
            filter.push({ '$dealer.user.region_activity_id$': data.region});
        }

        if(blum){
            filter = {[Op.and]:[ ...filter ]};
        }else{
            filter = {[Op.and]:[ {dealer_id: { [Op.in]: data.dealer_ids }}, ...filter ]};
        }

        let include = [{ model: models.address}];
        if(data.needDealer){
            include.push({ model: models.dealer, attributes:['company_name'], include:[
                    { model: models.user , attributes:['region_activity_id'], include:[
                            { model: models.region_activity, attributes:['region']}]
                    },
                ]
            });
        }

        let orders = await models.booking.findAndCountAll({
            where: filter,
            attributes: ['id','date','total_price','status','comment', [sequelize.literal(`(
                    SELECT company_name
                    FROM client 
                    WHERE client.user_id = booking.user_id )`),  'company_name'] ],
            include: include,
            offset:offset,
            limit:limit,
            order:order,
            distinct:true
        });
        // orders = JSON.parse(JSON.stringify(orders));
        let rows = orders.rows.map((item) => item.toJSON())
        orders = { count: orders.count, rows }

        const countPages = Math.ceil(orders.count / perPage);

        return orders.count > 0 || orders.rows.length ? { orders:orders.rows, countItems:orders.count, countPages:countPages} : { orders:[], count:0, countItems:orders.count, countPages:countPages };
    },

    async getBookingById(id, dealer_id) {
        try {
            let filter = { id: id };
            if(dealer_id) filter.dealer_id = dealer_id;

            let result = await models.booking.findOne({
                where: filter,
                include: [
                    {model: models.user, attributes: ['id','first_name', 'last_name', 'email']},
                    {model: models.address},
                    {model: models.booking_attachment, attributes: ['id','path', 'doc_type']},
                    {
                        model: models.orders,
                        include: [
                            {
                                model: models.product,
                                include: [
                                    {
                                        model: models.product_variations,
                                        where: { id : {[Op.eq]: sequelize.col('orders.variation_id')}},
                                        required: false
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
            // JSON.parse(JSON.stringify(result));
            return result.toJSON();
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    changeOrderStatus: async(id, status) => {
        let result = await models.booking.update(status , {where: {id:id}});
        // result = JSON.parse(JSON.stringify(result));
        return  result.map(function(item) {
            return item.toJSON();
        })
    },

    getAllCompanies: async (filter) => {
        if(!filter) filter = null;
        const order = [['createdAt', 'DESC']];

        let companies = await models.client.findAll({
            where: filter,
            attributes: ['id', 'company_name'],
            order:order,
            distinct:true
        });
        // companies = JSON.parse(JSON.stringify(companies));

        return companies.map(function(item) {
            return item.toJSON();
        })
    },

    uploadBookingAttachments: async(attachments) => {
        let result = await models.booking_attachment.bulkCreate(attachments);
        // result = JSON.parse(JSON.stringify(result));
        return  result.map(function(item) {
            return item.toJSON();
        })
    },

    deleteDealer: async (id) => {
        let filter = id;
        if (typeof filter !== 'object') {
            filter = { id: id };
        }
        try {
            let dealer = await models.dealer.destroy({
                where: filter
            });

            return dealer;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    getBookingAttachment: async (id) => {
        let filter = id;
        if (typeof filter !== 'object') {
            filter = { id: id };
        }
        try {
            let attachment = await models.booking_attachment.findOne({
                where: filter
            });
// JSON.parse(JSON.stringify(attachment));;
            return attachment.toJSON();
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    checkCRMnumberExist: async (crm_number) => {
        try {
            let isCRM_number = await models.client.findOne({where: {crm_number: crm_number}});
            return isCRM_number ? true:false;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    updateDealerById: async (dealer, id ,trans)=>{
let transaction= null;
try {
    transaction = trans ? trans : await sequelize.transaction();
   let result= await models.dealer.update(dealer, { where: {id} , transaction} )
    
    
    if (!trans) await transaction.commit();
  
    return result;

} catch (err) {
    if (transaction) await transaction.rollback();
    err.code = 400;
    throw err;
}



    },

    getDealerId: async (user_id) => {
        try {
            let dealerId = await models.dealer.findOne({ where: {user_id: user_id}, attributes: ['id']});
            const result = dealerId && dealerId.id ? dealerId.id : null;

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
// getAllManagerSr : async ()=>{

// try {
//   return await models.manager_sr.findAll({
//     include:[
//         {model: models.user, attributes: ['first_name', 'last_name']},
//         {model: models.region_activity, through:{attributes:[]}, ...regionFilter },
//         {model: models.region_activity, through:{attributes:[]}, as: 'allRegions' },
//     ],})
    
// } catch (error) {
//     error.code= 400
// }}



}
