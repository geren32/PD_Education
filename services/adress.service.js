const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');

module.exports = {
    // createAddress: async (address) => {
    //     const result = await models.address.create(address);
    //     return result;
    // },

    // findAllAddress: async () => {
    //     const result = await models.address.findAll();
    //     return result;
    // },

    // getAddressById: async (id) => {
    //     const result = await models.address.findOne({
    //         where: { id: id }
    //     });
    //     return result;
    // },

    // deleteAddressById: async (id) => {
    //     const result = await models.address.destroy({
    //         where: { id: id }
    //     });
    //     return result;
    // },

    // editAddress: async (id, address, trans) => {
    //     let transaction = null;
    //     try {
    //         transaction = trans ? trans : await sequelize.transaction();
    //         await models.address.update(address, { where: { id }, transaction });
    //         if (!trans) await transaction.commit();
    //         let result = models.address.findOne({
    //             where: { id: id }
    //         })
    //         return result
    //     } catch (err) {
    //         if (transaction) await transaction.rollback();
    //         err.code = 400;
    //         throw err;
    //     }
    // },

    // Address: async (address) => {
    //     const result = await models.address.create(address);
    //     return result;
    // },
}
