const { models, model } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const { Op, json } = require("sequelize");
const config = require('../configs/config');

const userAttributes = [
    'last_name',
    'first_name',
    'email',
    'phone',
];



module.exports = {
    createUser: async (users, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            const result = await models.users.create(users, transaction);
            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },

    getUser: async (params, attributes) => {
        let filter = params;
        if (typeof params !== 'object') {
            filter = { id: params }
        }
        const result = await models.users.findOne({
            where: filter,
            attributes: attributes
        });
        return result;
    },
 getAllUsersByRegions : async(filter)=>{

    try {
         let result = await models.users.findAll({where: filter,
            include: [
            { model: models.dealer, attributes: ['id', 'company_name', 'manager_sr_id'], include:[ {model: models.manager_sr} ]}]})

            return result;
        } catch (error) {
        error.code=400
    }


 },
    getAllUser: async (params, attributes) => {
        let filter = params;
        if (typeof params !== 'object') {
            filter = { id: params }
        }
        const result = await models.users.findAll({
            where: filter,
            attributes: attributes
        });
        return result;
    },

    getUserDetails: async (params, attributes) => {
        let filter = params;
        if (typeof params !== 'object') {
            filter = { id: params }
        }
        const result = await models.users.findOne({
            where: filter,
            attributes: attributes,
            include: [
                {
                    model: models.client,
                    include: [
                        { model: models.position_activity },
                        { model: models.activity },
                        { model: models.dealer }
                    ]
                },
                { model: models.dealer, include: [
                        { model: models.position_activity },
                        { model: models.activity },
                        { model: models.client },
                        { model: models.phone_numbers},
                        { model: models.manager_sr}
                    ] },
                { model: models.manager_sr, include:[
                        {model: models.activity},
                        {model: models.position_activity},
                        {model: models.region_activity, through:{attributes:[]} },
                        {model: models.dealer}
                    ] },
                { model: models.manager_blum },
                { model: models.region_activity, required: false },

            ]
        });
        if(result && result.manager_sr) {
            if(result.manager_sr.dealers && result.manager_sr.dealers.length) {
                result.dataValues.manager_sr.dataValues.fixed_dealers = result.manager_sr.dealers.map((dealer) => {
                    return dealer.id;
                })
            }
            if(result.manager_sr.region_activities && result.manager_sr.region_activities.length) {
                result.dataValues.manager_sr.dataValues.fixed_regions = result.manager_sr.region_activities.map((region) => {
                    return region.id;
                })
            }
        }
        if (result && result.dealer && result.dealer.phone_numbers && result.dealer.phone_numbers.length) {
            result.dealer.phone_numbers.forEach(phone => {
                phone.icon = JSON.parse(phone.icon)
                return phone
            })
        }
        return result;
    },

    getAllUsers: async (attributes) => {
        const result = await models.users.findAndCountAll({
            attributes: attributes
        });

        return result.count > 0 && result.rows.length ? {
            users: result.rows,
            count: result.count
        } : { users: [], count: 0 };
    },

    getUserById: async (users_id) => {
        try {

            let result = await models.users.findByPk(users_id, {
                attributes: ['id', 'last_name', 'first_name', 'email', 'phone', 'type', 'created_at', 'bonuses'],

            });

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    filterUser: async (filter) => {
        try {

            let result = await models.users.findOne({ where: filter });

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    adminGetAllUsers: async (filter, page, perPage, attributes) => {
        try {

            const offset = perPage * (page - 1);
            const limit = perPage;

            let result = await models.users.findAndCountAll({
                where: filter.where,
                offset: offset,
                limit: limit,
                order: filter.sort,
                attributes: attributes,
            });


            return result.count > 0 && result.rows.length ? {
                data: result.rows,
                count: result.count
            } : { data: [], count: 0 };

        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    adminCountsStatus: async (statusCode) => {
        try {

            let result = await models.users.findAndCountAll({
                where: { status: statusCode },
            });
            if(result==0){
                result= config.GLOBAL_STATUSES.DELETED
           }
           if(result==1){
               result=config.GLOBAL_STATUSES.ACTIVE;
           }
           if(result==3){
               result=config.GLOBAL_STATUSES.WAITING
           }
         if(result==="all"){
       result={ [Op.ne]: config.GLOBAL_STATUSES.DELETED }
         }
            return result.count ? result.count : 0;

        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    adminCountsAllStatus: async () => {
        try {

            let result = await models.users.findAndCountAll({
                where: {
                    status: {
                        [Op.ne]: 0
                    },
                }
            });

            return result.count ? result.count : 0;

        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

   

    findUsersByFilter: async (filter) => {
        let result = await models.users.findAll({
            where: filter,
            attributes: ['id', 'last_name', 'first_name', 'email', 'phone', 'type'],

        })
        return result;
    },
    updateUserByFilter: async (data, filter) => {
        try {

            await models.users.update(data, { where: filter });
            let result = await models.users.findOne({ where: filter });

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    deleteUserById: async (id,trans) => {
        let transaction= null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            await models.users.destroy(data, { where: id ,transaction});
            let result = await models.users.findOne({ where: id },transaction);
            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            if (transaction) await transaction.rollback();
            err.code = 400;
            throw err;
        }
    },

    updateUser: async (filter, data, trans) => {
        let transaction = null;
        try {

            transaction = trans ? trans : await sequelize.transaction();
            await models.users.update(data, {
                where: filter,
                transaction
            });
            // let result = await models.users.findOne({
            //     where: {
            //         id: id
            //     },
            //     transaction
            // });
            if (!trans) await transaction.commit();
            return true;
        } catch (err) {
            if (transaction) await transaction.rollback();
            err.code = 400;
            throw err;
        }
    },

    makeUserFilter: async (body, whereObj) => {

        let arr = [];

        let sort;


        if (body.search) {
            let searchField = body.search.trim().split(" ");
            if (searchField && searchField.length) {
                let like = [];
                searchField.forEach((item) => {
                    like.push({ [Op.like]: `%${item}%` });
                });
                arr.push({
                    [Op.or]: [
                        { first_name: { [Op.or]: like } },
                        { last_name: { [Op.or]: like } }
                    ]
                });
            }
        }
        if (body.type && body.type.length) {
            let types = [];
            body.type.forEach((item) => {
                types.push({ type: item });
            });
            arr.push({ [Op.or]: types });
        }
        if (body.status && body.status != 'all') {

            arr.push({ status: body.status });

        }

        if (body.sort) {
            if (body.sort.created_at) {
                sort = [['createdAt', body.sort.created_at]];
            }
        } else {
            sort = [['createdAt', 'DESC']];
        }

        let filter = { sort, where: { [Op.and]: [whereObj, ...arr] } };


        return filter;
    },
 updateClientById: async (client,trans)=>{
    let transaction= null;
    try {
        transaction = trans ? trans : await sequelize.transaction();
       let result= await models.client.update(client, { where: {id }, transaction})

       result= await models.client.findOne({
           where:{
               id:result.id
            },
    include:[{model:models.users, attributes:userAttributes}]
})

        if (!trans) await transaction.commit();

        return result;

    } catch (err) {
        if (transaction) await transaction.rollback();
        err.code = 400;
        throw err;
    }





 },
    // findAllAcivity: async () => {
    //     let result = await models.activity.findAll({
    //         attributes: ['id', 'title'],
    //     })

    //  return  result.map(function(item) {
    //         return item.toJSON();
    //     })


    // },

    findAllPositionAcivity: async () => {
        let result = await models.position_activity.findAll({
            attributes: ['id', 'title'],
        })
        return     result.map(function(item) {
            return( item.toJSON())
        })

    },

    deleteClient: async (id) => {
        let filter = id;
        if (typeof filter !== 'object') {
            filter = { id: id };
        }
        try {
            let client = await models.client.destroy({
                where: filter
            });

            return client;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
 getClientById:async (where)=>{

    try{
let result = await models.client.findOne({where: where,
include:[
    {model:models.users, attributes:userAttributes}
]})

        return result
    }
    catch (err) {
        err.code = 400;
        throw err;
    }
 },

    getClient: async (params, attributes) => {
        let filter = params;
        if (typeof params !== 'object') {
            filter = { id: params }
        }
        const result = await models.client.findOne({
            where: filter,
            attributes: attributes
        });
        return result;
    },
 createPhoneNumber :async(phone, trans)=>{
    let transaction = null;
    try{
        transaction = trans ? trans : await sequelize.transaction();
        let result = await models.phone_numbers.create(phone,{transaction});

        if (!trans) await transaction.commit();
        return result;


    }
    catch (err) {
        if (transaction) await transaction.rollback();
        err.code = 400;
        throw err;
    }




 },
deleteNumberByDealerId : async(id,trans)=>{
    let transaction = null;
    try {
        transaction = trans ? trans : await sequelize.transaction();
        let result = await models.phone_numbers.destroy({
            where: id,
        transaction} )
        if (!trans) await transaction.commit();
        return result;
    } catch (err) {
        err.code = 400;
        if (transaction) await transaction.rollback();
        throw err;
    }
},





}
