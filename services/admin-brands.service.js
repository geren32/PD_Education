const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const Sequelize = require('sequelize');
const moment = require('moment');
const config = require('../configs/config');
const { Op } = Sequelize;

module.exports = {
    checkForAvailability: async (title) =>{
        try {
            title = JSON.stringify(title);
            let result = await models.brands.findOne({
                where:
                    {title: title}
            })
            console.log(result);
            return result;

        }catch (error) {
            error.code=400
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















}