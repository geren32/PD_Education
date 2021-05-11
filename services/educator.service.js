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
            filter = { user_id: user_id }
        }
       try {
           const result = await models.education.findAll({
               where: filter,
               attributes: ['date', 'hours', 'client_number', 'education_status', 'contact_phone', 'contacted_date', 'education_type','address_id'],


                    include: [
                        {model: models.salon_address, attributes: ['address'],}
                    ]
       });
           return result.map(function(item) {
               return item.toJSON();
           })
           console.log(result);
       }catch (error) {
           error.code=400
       }

    },
    alreadyTraining: async (id) => {
        const read = await models.education.update({is_read_rejection: true,education_status:config.GLOBAL_STATUSES.ACTIVE ,
            contact_date:Math.floor(new Date().getTime() / 1000),}, {where: { id: id }});
        return read;
    },



    getDatta : async (user_id) =>{
        try {

            const result = await models.educator.create({
                user_id,
                date,
            } )
            return result;
        }   catch (err) {
            err.code = 400;
            throw err;
        }
    },
    getProductsForTraining: async (id) => {
        try {
            let result = await models.products.findAll({
               attributes: ['title','price']
            })
            return result;

        }catch (error){
            error.code= 400
        }
    },
    returnIn7Days: async (id) => {
        try {
            let result = await models.education.findAll({
                attributes:['contacted_date','education_status']
            })
            return result;

        }catch (error) {
            error.code = 400

        }
    }



}