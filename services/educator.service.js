const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const Sequelize = require('sequelize');
const moment = require('moment');
const config = require('../configs/config');
const { Op } = Sequelize;


module.exports = {
    GetAssignedTraining: async (user_id) => {
        let filter = user_id;
        if (typeof user_id !== 'object') {
            filter = { id: user_id }
        }

       try {
           const result = await models.education.findOne({
               where: filter,
                   include: [
                       {
                           model: models.education,
                           include: [{model: models.salon_address, attributes: ['address']}],
                           model: models.education,
                           attributes: ['date', 'hours', 'client_number', 'education_status', 'contact phone','contacted_date','education_type']

                       }
                   ]
               })
            return result.toJSON();
       }catch (error) {
           error.code=400
       }

    },
    alreadyTraining: async (id) => {
        const read = await models.education.update({is_read_rejection: true,education_status:config.GLOBAL_STATUSES.ACTIVE ,
            contact_date:Math.floor(new Date().getTime() / 1000),}, {where: { id: id }});
        return read;
    },

    getDatta : async (trans) =>{
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.educator.create(date,{transaction});

            if (!trans) await transaction.commit();
            return result;


        }   catch (err) {
            if (transaction) await transaction.rollback();
            err.code = 400;
            throw err;
        }
    },
    getProductsForTraining: async (id) => {
        try {
            let result = await models.products.findAll({
               attributes: ['title','price']
            })

        }catch (error){
            error.code= 400
        }
    },
    returnIn7Days: async (id) => {
        try {
            let result = await models.education.findAll({
                attributes:['educated_date','education_status']

            })

        }catch (error) {
            error.code = 400

        }
    }



}