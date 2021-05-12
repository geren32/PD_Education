const { models } = require("../sequelize-orm");
const sequelize = require("../sequelize-orm");
const { Op } = require("sequelize");
const config = require("../configs/config");

const userAttributes = ["last_name", "first_name", "email", "phone"];
const salonAttributes = [
    "billing_first_name",
    "billing_last_name",
    "billing_phone",
    "billing_email",
];

module.exports = {
    getSalesPersons: async (filter) => {
        // if (!filter) filter = null;
        let overview = await models.salon.findOne({
            where: { id: filter },
            include: [
                { model: models.users, attributes: userAttributes },
                {
                    model: models.sales_person,
                    attributes: ["address"],
                    include: [{ model: models.users, attributes: userAttributes }],
                },
            ],
        });

        let arr = overview.sales_id.split(",");

        let list = [];
        if (arr && arr.length) {
            let sales_ids = [];
            arr.forEach((element) => {
                sales_ids.push(element);
            });
            list.push({ [Op.or]: sales_ids });
        }

        let arr2 = [];
        for (let item of list) {
            let result = await models.sales_person.findAll({
                where: { id: item },
                include: [{ model: models.users, attributes: userAttributes }],
            });

            result = result.map(function (item) {
                return item.toJSON();
            });

            arr2.push(result);
        }
        return arr2;
    },

    MessageToSales: async (data, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            console.log(data);
            let result = await models.sales_message.create(data, { transaction });

            if (!trans) await transaction.commit();

            return result;
        } catch (error) {
            error.code = 400;
            if (transaction) await transaction.rollback();
            throw error;
        }
    },
    getSalonById: async (id, trans) => {


        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.salon.findOne({
                where: { id: id },
                include: [{ model: models.users, attributes: userAttributes }],
                transaction,
            });


            return result.toJSON();
        } catch (error) {
            err.code = 400;

            throw err;
        }
    },
    updateSalonById: async (data, id, trans) => {


        try {
            transaction = trans ? trans : await sequelize.transaction();

            let result = await models.salon.update(
                data,
                { where: id },
                { transaction }
            );

            result = await models.salon.findOne({
                where: id,
                include: [{ model: models.users, attributes: userAttributes }],
                transaction,
            });

            if (!trans) await transaction.commit();
            return result.toJSON();
        } catch (error) {
            error.code = 400;
            if (transaction) await transaction.rollback();
            throw error;
        }
    },

    getSalonAdressBySalonId: async (id) => {
        try {
            let result = await models.salon_address.findAll({
                where: { salon_id: id },
                include: [{ model: models.salon, attributes: salonAttributes }],
            });

            result = result.map(function (item) {
                return item.toJSON();
            });

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    editSalonAddressById: async (data, id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.salon_address.update(
                data,
                { where: id },
                { transaction }
            );

            result = await models.salon_address.findOne({
                where: id,
                include: [{ model: models.salon, attributes: salonAttributes }],
                transaction,
            });

            if (!trans) await transaction.commit();
            return result.toJSON();
        } catch (error) {
            error.code = 400;
            if (transaction) await transaction.rollback();
            throw error;
        }
    },
    deleteSalonAddressId: async (id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.salon_address.destroy({
                where: { id: id },
                transaction,
            });
            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },
    getSalonBrands: async (id) => {
        let date = new Date();
        let rangesix = Math.floor(date.getTime() / 1000) - config.SIX_MOUNTH_DATE;

        try {
            // transaction = trans ? trans : await sequelize.transaction();
            let result = await models.salon_brands.findAll({
                where: {
                    [Op.and]: [{ salon_id: id }, { date: { [Op.gt]: rangesix } }],
                },
                include: [{ model: models.brands, attributes: ["title", "logo"] }],
            });

            return result.map(function (item) {
                return item.toJSON();
            });
        } catch (error) {
            error.code = 400;
            throw error;
        }
    },
    getBrandPromotions: async (id) => {
        let date = new Date();
        let period_date = Math.floor(date.getTime() / 1000);

        // let rangesix = Math.floor(date.getTime() / 1000) - config.SIX_MOUNTH_DATE;

        try {
            // // transaction = trans ? trans : await sequelize.transaction();
            // let result = await models.salon_brands.findAll({
            //     where: {
            //         [Op.and]: [{ salon_id: id }, { date: { [Op.gt]: rangesix } }],
            //     },
            //     include: [{ model: models.brands, attributes: ["title", "logo"] }],
            // });
            // let list = [];
            // for (let item of result) {
            //     list.push(item.brand_id);
            // }

            let result = await models.promotions.findAll({
                where: {
                    [Op.and]: [
                        { brand_id: id },
                        { active: 1 },
                        { start_date: { [Op.lt]: period_date } },
                        { end_date: { [Op.gt]: period_date } },
                    ],
                },
                include: [{ model: models.brands, attributes: ["title", "logo"] }],
            });

            return result.map(function (item) {
                return item.toJSON();
            });
        } catch (error) {
            error.code = 400;
            throw error;
        }
    },
    getMaterialsCatById: async (id) => {
        try {
            let result = await models.materials_cat.findAll({ where: { brand_id: id } })
            return result.map(function (item) {
                return item.toJSON();
            });

        } catch (error) {
            error.code = 400;
            throw error;
        }
    },
    getMaterials: async (id) => {

        try {
            let result = await models.materials.findAll({
                where: { cat_id: id },
                include: [{
                    model: models.materials_cat, attributes: ['title', 'type', 'section', 'brand_id'],
                    include: [{ model: models.brands, attributes: ["title", "logo"] }
                    ]
                }]
            })
            return result.map(function (item) {
                return item.toJSON();
            });


        } catch (error) {
            error.code = 400;
            throw error;
        }

    }

};
