const { models, model } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const { Op, where } = require("sequelize");



const userAttributes = [

    'last_name',
    'first_name',
    'email',
    'phone',
];
const salonAttributes = [
    'billing_first_name',
    'billing_last_name',
    'billing_phone',
    'billing_email'

]




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

        let arr = overview.sales_id.split(',');

        let list = [];
        if (arr && arr.length) {
            let sales_ids = [];
            arr.forEach((element) => {
                sales_ids.push(element);
            });
            list.push({ [Op.or]: sales_ids })

        }


        let arr2 = [];
        for (let item of list) {

            let result = await models.sales_person.findAll({
                where: { id: item },
                include: [{ model: models.users, attributes: userAttributes }]
            });

            result = result.map(function (item) {
                return item.toJSON();
            })

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
        let transaction = null;

        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.salon.findOne({
                where: { id: id },
                include: [{ model: models.users, attributes: userAttributes }]
                , transaction
            })
            if (!trans) await transaction.commit();


            return result.toJSON();


        } catch (error) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }

    },
    updateSalonById: async (data, id, trans) => {
        let transaction = null;

        try {
            transaction = trans ? trans : await sequelize.transaction();

            let result = await models.salon.update(data, { where: id }, { transaction })

            result = await models.salon.findOne(
                {
                    where: id,
                    include: [{ model: models.users, attributes: userAttributes }], transaction
                })


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
                include: [
                    { model: models.salon, attributes: salonAttributes }
                ]
            });

            result = result.map(function (item) {
                return item.toJSON();
            })

            return result
        }
        catch (err) {
            err.code = 400;
            throw err;
        }
    },
    editSalonAddressById: async (data, id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.salon_address.update(data, { where: id }, { transaction });

            result = await models.salon_address.findOne({
                where: id,
                include: [
                    { model: models.salon, attributes: salonAttributes }
                ],
                transaction
            });

            if (!trans) await transaction.commit();
            return result.toJSON();
        }
        catch (error) {
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
                transaction
            })
            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },
    getSalonBrands: async (id) => {

        try {
            let result = await models.salon_brands.findAll({
                where: id,
                include: [
                    { model: models.brands, attributes: ['title', 'logo'] }
                ]
            })
          
            for (let item of result) {
                

                result = await models.salon_brands.findAll({
                    where: { date: { [Op.lt]: item.date + 15778800 } },
                    include: [
                        { model: models.brands, attributes: ['title', 'logo'] }
                    ]
                })
                // console.log(result.map(function (item) {
                //     return item.toJSON();
                // }));
               return result.map(function (item) {
                    return item.toJSON();
                }) 
            }


        } catch (error) {
            error.code = 400;
            throw error;

        }
    }





}