const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
// const {Op} = sequelize("sequelize");

const addressAttributes = [
    'title',
    'adress',
    'city',
    'zip',
    'first_name',
    'last_name',
    'email',
    'phone',
    'email',
    'email_contact',

];
const salonAttributes = [
    'id',
    'title',
    'address',
    'salon_number',
    'billing_title',
    'billing_address',
    'billing_city',
    'billing_zip',
    'billing_nip',
    'billing_first_name',
    'billing_last_name',
    'billing_phone',
    'billing_email'
]

module.exports = {

    createInvoce: async (invoces, trans) => {

        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.invoice.create(invoces, { transaction });

            result = await models.invoice.findOne({
                where: { id: result.id },
                transaction
            })
            if (!trans) await transaction.commit();

            return result.toJSON();


        } catch (error) {
            error.code = 400;
            if (transaction) await transaction.rollback();
            throw error;
        }
    },
    editInvoceById: async (invoice, id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.invoice.update(invoice, { where: { id }, transaction })
            // let result = await models.invoice.findOne({
            //     where: { id: id },
            //     transaction,
            //     include: [
            //         { model: models.address, attributes: addressAttributes },
            //         { model: models.user, attributes: userAttributes }
            //     ]
            // })


            if (!trans) await transaction.commit();

            return result;

        } catch (err) {
            if (transaction) await transaction.rollback();
            err.code = 400;
            throw err;
        }



    },
    deleteInvoiceById: async (id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.invoice.destroy({
                where: { id: id },
                transaction
            })
            // result= await models.invoces.findOne({where:{id:result.id},transaction});
            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },
    getAllInvoice: async () => {
        let result = await models.invoice.findAll({
            include: [{ model: models.salon, attributes: salonAttributes },
            {model: models.orders, attributes:['id','date','products']}]
        });

        return result.map(function (item) {
            return item.toJSON();
        });


    }



}