const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const {Op} = require("sequelize");


const addressAttributes = [
    'street',
    'apartment',
    'entrance',
    'floor',
    'intercom',
    'district',
    'city',
    'country',
    'first_name',
    'last_name',
    'email',
    'phone'
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

    createPayment:  async (payment, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.payment.create(payment, transaction);
            if (!trans) await transaction.commit();
            result = await models.payment.findOne({
                where: {id: result.id},
                include: [
                    {
                        model: models.booking, as: "booking", attributes: bookingAttributes,
                        include: [{model: models.address, as: "address", attributes: addressAttributes}]
                    },
                    {model: models.user, as: "user", attributes: userAttributes}
                ]
            })

            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },

    getAllPayments:  async (settings) => {
        try {
            let where = {}
            let offset = 0
            if (settings.user_id) {
                where.user_id = settings.user_id
            }
            if (settings.status) {
                where.status = settings.status
            }
            if (settings.page && settings.perPage) {
                offset = settings.perPage * (settings.page - 1);
            }
            let result = await models.payment.findAll({
                where: where,
                offset: offset,
                include: [
                    {
                        model: models.booking, as: "booking", attributes: bookingAttributes,
                        include: [{model: models.address, as: "address", attributes: addressAttributes}]
                    },
                    {model: models.user, as: "user", attributes: userAttributes}
                ]
            })
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    getPaymentById:  async (id) => {
        try {

            let result = await models.payment.findOne({
                where: {id: id},
                include: [
                    {
                        model: models.booking, as: "booking", attributes: bookingAttributes,
                        include: [{model: models.address, as: "address", attributes: addressAttributes}]
                    },
                    {model: models.user, as: "user", attributes: userAttributes}
                ]
            })
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    deletePayment:  async (id) => {
        try {
            let result = await models.payment.destroy({
                where: {id: id}
            })
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    editPayment:  async (payment, id,trans) => {
        let transaction= null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            await models.payment.update(payment, {where: {id},transaction})
            let result = models.payment.findOne({
                where: {id: id},
                include: [
                    {
                        model: models.booking, as: "booking", attributes: bookingAttributes,
                        include: [{model: models.address, as: "address", attributes: addressAttributes}]
                    },
                    {model: models.user, as: "user", attributes: userAttributes}
                ],
                transaction
            })
            if (!trans) await transaction.commit();
            return result;

        } catch (err) {
            if (transaction) await transaction.rollback();
            err.code = 400;
            throw err;
        }
    },



}
