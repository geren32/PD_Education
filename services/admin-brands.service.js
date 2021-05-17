const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const Sequelize = require('sequelize');
const moment = require('moment');
const config = require('../configs/config');
const { Op } = Sequelize;

module.exports = {
    checkForAvailability: async (title) =>{
        try {
             const audit = await models.brands.findOne({
                where:
                    {title: title}
            })
            console.log(audit);
            return audit;

        }catch (err) {
            err.code = 400;
            throw err;
        }
    },




    createBrands: async (brandsObj) => {
        try {
            let result = await models.brands.create(brandsObj)
            return result.toJSON();

        }catch (error) {
            error.code=400
        }
    },
    updateBrands: async (id,title,logo) => {
        try {
            let result = await models.brands.update({title:title,logo:logo},{where:{id:id}})
            return result;

        }catch (error){
            error.code=400
        }
    },
    deleteBrands: async  (id) => {
        try{
            let result = await models.brands.destroy({where:{id:id}})
            return result;

        }catch (error) {
            error.code=400
        }
    }















}