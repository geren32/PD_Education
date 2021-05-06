const { models, model } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");


const addressAttributes = [
    'street',
    'house',
    'apartment',
    // 'entrance',
    // 'floor',
    // 'intercom',
    // 'district',
    'city',
    // 'country',
    'first_name',
    'last_name',
    'email',
    'phone',
    'pay_type',
    'delivery_type',
    'department'
];
const productAttributes = [
    'variation',
    'type',
    'status',
    'short_description',
    'description',
    'name',
    'price',
    'old_price',
    'availability',
    'brand_id',
    'model_id',
    'sku',
    'promotional',
    'novelty',
    'popular',
    'image'
];
const userAttributes = [
    'last_name',
    'first_name',
    'email',
    'phone',
];
const bookingAttributes = [
    'id',
    'date',
    'total_price',
    'user_id',
    'address_id',
    'status'
];
const variationAttributes = [
    'id',
    'product_id',
    'price',
    'old_price',
    'status',
    'sku',
    'gallery'
];

module.exports = {
    createBookingRevision: async (booking,trans)=>{
    let transaction=null;
    try{
        transaction = trans ? trans : await sequelize.transaction();
        let result = await models.booking_revision.create(booking,{transaction});
        result = await models.booking_revision.findOne({
            where: {id:result.id},
            transaction,
            include: [ {model:models.booking,attributes:bookingAttributes,include: {model: models.user, attributes: ['id','first_name','last_name']}}]
        })
        if (!trans) await transaction.commit();
        return result;
    }
 catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }



    },
    createBookingHistory: async(booking,trans)=>{
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result= await models.booking_history.create(booking,{transaction});
            result= await models.booking_history.findOne({
                where: {id:result.id},
                transaction,
                include:[{model:models.user, attributes:userAttributes},
                  {model:models.booking,attributes:bookingAttributes,include: {model: models.user, attributes: ['id','first_name','last_name']}}
                ]
            })
            if (!trans) await transaction.commit();
            return result;
        }
        catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }

    },
    createBooking: async (booking, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.booking.create(booking, {transaction});

            result = await models.booking.findOne({
                where: { id: result.id },
                transaction,
                include: [
                    { model: models.address, attributes: addressAttributes },
                    { model: models.user, attributes: userAttributes }
                ]
            })
            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },

    getAllBookings: async (settings, page, perPage, currency) => {
        try {
            let where = [];
            // let where = {
            //     // id: { [Op.eq]: sequelize.col('orders.booking_id') },
            //     // '$orders.variation_id$': { [Op.eq]: sequelize.col('orders.product.product_variations.id') }
            // }
            if (settings.search) {
                let searchField = settings.search.trim().split(" ");
                if (searchField && searchField.length) {
                    let like = [];
                    searchField.forEach((item) => {
                        like.push({ [Op.like]: `%${item}%` });
                    });
                    where.push({
                        [Op.or]: [
                            {id: { [Op.or]: like }},
                            { '$address.first_name$': { [Op.or]: like } },
                            { '$address.last_name$': { [Op.or]: like } }
                        ]
                    });
                }
            }
            let offset = 0
            // if(settings.dealer_id) {
            //     where.push({ dealer_id: settings.dealer_id});
            // }
            if (settings.dealer_id &&  settings.dealer_id.length) {
                let dealer_ids = [];
                settings.dealer_id.forEach((item) => {
                    dealer_ids.push({ dealer_id: item });
                });
                where.push({ [Op.or]: dealer_ids });
            }
            if (settings.status === 'all') {
                where.push({status: { [Op.ne]: 0 }})
                // where.push({ status: settings.status});
            } else if (settings.status) {
                where.push({ status: settings.status});
            }
            if (settings.region_activity_id &&  settings.region_activity_id.length) {
                let region_activity_ids = [];
                settings.region_activity_id.forEach((item) => {
                    region_activity_ids.push({ '$user.region_activity_id$': item });
                });
                where.push({ [Op.or]: region_activity_ids });
            }
            // if(settings.region_activity_id) {
            //     userWhere.push({region_activity_id: settings.region_activity_id});
            // }
            if (settings.dateFrom || settings.dateTo) {
                let createdAt = {};
                // if (settings.dateFrom) createdAt[Op.gte] = settings.dateFrom.getTime()/1000;
                // if (settings.dateTo) createdAt[Op.lte] = settings.dateTo.getTime()/1000;
                if (settings.dateFrom) createdAt[Op.gte] = new Date(settings.dateFrom).getTime()/1000;
                if (settings.dateTo) {
                    if (settings.dateFrom == settings.dateFrom) {
                        createdAt[Op.lte] = (new Date(settings.dateTo).getTime()/1000) + 86400;
                    } else {
                        createdAt[Op.lte] = new Date(settings.dateTo).getTime()/1000;
                    }
                }


                where.push({ createdAt: createdAt });
            }
            if (settings.priceFrom || settings.priceTo) {
                let total_price = {};
                if (settings.priceFrom) total_price[Op.gte] = settings.priceFrom/currency;
                if (settings.priceTo) total_price[Op.lte] = settings.priceTo/currency;

                where.push({ total_price: total_price });
            }
            if (page && perPage) {
                offset = perPage * (page - 1);
            }

            let result = await models.booking.findAndCountAll({
                // where: {[Op.and]:[ ...where ]},
                where: where,
                offset: offset,
                limit: perPage,
                sort: [['createdAt', 'DESC']],
                distinct:true,
                include: [
                    { model: models.dealer },
                    { model: models.address },
                    { model: models.user, attributes: ['last_name', 'first_name', 'email', 'phone', 'region_activity_id'],
                    include: { model: models.region_activity, required: false },
                    },
                    // {
                    //     model: models.orders,
                    //     attributes: ['type', 'id', 'product_id', 'booking_id', 'price', 'count'],
                    //     include: [
                    //         {
                    //             model: models.product, attributes: productAttributes,
                    //             include: [
                    //                 { model: models.model, attributes: ['title'] },
                    //                 { model: models.brand, attributes: ['title'] },
                    //                 {
                    //                     model: models.product_category,
                    //                     as: 'category',
                    //                     attributes: ['id', 'title','slag'],
                    //                     through: { attributes: [] }
                    //                 },
                    //                 {
                    //                     model: models.product_variations,
                    //                     as: "product_variations",
                    //                     attributes: variationAttributes,
                    //                     include: [
                    //                         {
                    //                             model: models.attribute,
                    //                             as: 'attribute',
                    //                             attributes: ['id', 'title', 'value', 'status', 'type'],
                    //                             through: { attributes: ['value'], as: 'activeValue' }
                    //                         }
                    //                     ]
                    //                 }
                    //             ]
                    //         }
                    //     ]
                    // }
                ]
            })
            if(result && result.rows && result.rows.length) {
                result.rows = result.rows.map(row => {
                    row.toJSON()
                    let region = null;
                    let dealer = null;
                    if(row.dealer && row.dealer.company_name) dealer = row.dealer.company_name;
                    if(row.user && row.user.region_activity && row.user.region_activity.region) region = row.user.region_activity.region;
                    row ={
                        id: row.id,
                        status: row.status,
                        created_at: row.createdAt,
                        first_name: row.address.first_name,
                        last_name: row.address.last_name,
                        region: region,
                        dealer: dealer
                    }
                    return row
                });
            }
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    getBookingById: async (id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.booking.findOne({
                where: {
                    id: id,
                    //TODO check coment
                    // '$orders.variation_id$' : {[Op.eq] : sequelize.col('orders.product.product_variations.id')}
                },
                include: [
                    { model: models.address, attributes: addressAttributes },
                    { model: models.user, attributes: userAttributes, include: {model: models.region_activity} },
                    { model: models.booking_attachment},
                    { model: models.dealer},
                    { model: models.booking_revision},
                    { model: models.booking_history, include: {model: models.user, attributes: ['id','first_name','last_name']}},
                    {
                        model: models.orders,
                        attributes: ['type', 'id', 'product_id', 'booking_id', 'price', 'count'],
                        include: [
                            {
                                model: models.product, attributes: productAttributes,
                                include: [
                                    { model: models.model, attributes: ['title'] },
                                    { model: models.brand, attributes: ['title'] },
                                    {
                                        model: models.product_category,
                                        as: 'category',
                                        attributes: ['id', 'title','slag'],
                                        through: { attributes: [] }
                                    },
                                    {
                                        model: models.product_variations,
                                        as: "product_variations",
                                        attributes: variationAttributes,
                                        include: [
                                            {
                                                model: models.attribute,
                                                as: 'attribute',
                                                attributes: ['id', 'title', 'value', 'status', 'type'],
                                                through: { attributes: ['value'], as: 'activeValue' }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
            if (!trans) await transaction.commit();
            return result
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    deleteBookingById: async (id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.booking.destroy({
                where: { id: id },
            transaction} )
            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },
    deleteBookingRevisionById: async(id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
         return    await models.booking_history.destroy({
                where: { id: id }, transaction } );


        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },
    deleteBookingHistoryById: async(id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
         return    await models.booking_history.destroy({
                where: { id: id }, transaction } );

        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },
    deleteBookingAttachmentById: async(id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
         return    await models.booking_attachment.destroy({  where: { id: id }, transaction } );

        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },
    editBooking: async (booking, id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            await models.booking.update(booking, { where: { id }, transaction })
            let result = await models.booking.findOne({
                where: { id: id },
                transaction,
                include: [
                    { model: models.address, attributes: addressAttributes },
                    { model: models.user, attributes: userAttributes }
                ]
            })


            if (!trans) await transaction.commit();

            return result;

        } catch (err) {
            if (transaction) await transaction.rollback();
            err.code = 400;
            throw err;
        }
    },

    getCurrentBooking: async (where) => {
        try {

            let result = await models.booking.findOne({
                where: where,
                include: [
                    { model: models.address, as: "address", attributes: addressAttributes },
                    { model: models.user, as: "user", attributes: userAttributes }
                ]
            })
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    getCurrentCart: async (where) => {
        try {

            let result = await models.cart.findOne({
                where: where,
                include: [
                    { model: models.user, as: "user", attributes: userAttributes }
                ]
            })
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    createCart: async (cart, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.cart.create(cart, transaction);

            result = await models.cart.findOne({
                where: { id: result.id },
                transaction,
                include: [
                    { model: models.user, attributes: userAttributes }
                ]
            })
            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },
    editCart: async (booking, id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            await models.cart.update(booking, { where: { id }, transaction })
            let result = await models.cart.findOne({
                where: { id: id },
                transaction,
                include: [
                    { model: models.user, attributes: userAttributes }
                ]
            })
            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            if (transaction) await transaction.rollback();
            err.code = 400;
            throw err;
        }
    },
    deleteCart: async (id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.cart.destroy({
                where: { id: id }, transaction
            })
            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },
    countBookingsByParam: async () => {
        let result = await models.booking.findAll({
            raw: true,
            attributes: ['id', 'status']
        });
        function bookingStatuses(status) {
            let filteredBookings = [];
            if(status || status === 0) {
                result.forEach(booking => {
                    if(booking.status === status) filteredBookings.push(booking);
                })
            }else {
                result.forEach(booking => {
                    if(booking.status !== 0) filteredBookings.push(booking);
                })
            }
            return filteredBookings.length;
        }
        let numberOfDeletedBookings = bookingStatuses(0);
        let numberOfNewBookings = bookingStatuses(1);
        let numberOfProcessedBookings = bookingStatuses(2);
        let numberOfActiveBookings = bookingStatuses(3);
        let numberOfCanceledBookings = bookingStatuses(4);
        let numberOfFailedBookings = bookingStatuses(5);
        let numberOfAllBookings = bookingStatuses();
        return {
            all: numberOfAllBookings,
            0: numberOfDeletedBookings,
            1: numberOfNewBookings,
            2: numberOfProcessedBookings,
            3: numberOfActiveBookings,
            4: numberOfCanceledBookings,
            5: numberOfFailedBookings
        };
        // let result = await models.booking.count({
        //     where: whereObj
        // });
        // if(result==0) {
        //     result=0
        // }
        // if(result==1) {
        //     result=1
        // }
        // if(result==2) {
        //     result=2
        // }
        // if(result==3) {
        //     result=3
        // }
        // if(result==4) {
        //     result=4
        // }
        // if(result==5) {
        //     result=5
        // }
        // if(result=="all"){
        //     result={ [Op.ne]: 0 }
        // }
        // return result ? result : 0;
    },
    makeBookingFilter: async (body, whereObj) => {
        let arr = [];
        let userArr = [];
        let sort;

        if (body.search) {
            let searchField = body.search.trim().split(" ");
            if (searchField && searchField.length) {
                let like = [];
                searchField.forEach((item) => {
                    like.push({ [Op.like]: `%${item}%` });
                });
                userArr.push({ [Op.or]: [ { first_name: { [Op.or]: like } }, { last_name: { [Op.or]: like } }] });
                arr.push({ id: { [Op.or]: like } });
            }
        }
        if (body.status && body.status != 'all') {
            arr.push({ status: body.status });
        }
        if (body.dateFrom || body.dateTo) {
            let date = {};
            if (body.dateFrom) date[Op.gte] = body.dateFrom;
            if (body.dateTo) date[Op.lte] = body.dateTo;

            arr.push({ createdAt: date });
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
updateBookingHistoryById: async(booking,id,trans)=>{
 let transaction=null;

try{
    transaction = trans ? trans : await sequelize.transaction();
    let result = await models.booking_history.update(booking,{where:{id }},{transaction});
    result= await models.booking_history.findOne({where:{id: result.id}},transaction);
    if (!trans) await transaction.commit();

    return result;


}
catch(err){
    if (transaction) await transaction.rollback();
    err.code = 400;
    throw err;

}

}

}
