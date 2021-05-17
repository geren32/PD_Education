const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const Sequelize = require('sequelize');
const moment = require('moment');
const config = require('../configs/config');
const { Op } = Sequelize;

module.exports = {
    createEducator: async (EducatorObj) => {
        try {
            console.log(EducatorObj)
            let result = await models.educator.create(EducatorObj)
            return result
        }catch (err){
            err.code =400
            throw err
        }
    },
    updateEducator: async (id,brand_id) => {
        try{
            let result = await  models.educator.update({
                brand_id:brand_id},
                {where:{id:id}})
            return result;
        }catch (err){
            err.code = 400
            throw err
        }
    },
    deleteEducator: async (id) => {
        try {
            let result = await models.educator.destroy({where:{id:id}})
            return result;

        }catch (err) {
            err.code= 400
            throw err
        }
    },
    hoodOfAllEducatorForBrands: async (brand_id) => {
        try {
            let result = await models.educator.findAll({
                where:
                    {brand_id: brand_id}
            })
            return result.map(function(item) {
                return item.toJSON();
            })

        }catch (err){
            err.code = 400
            throw err
        }
    },
    getEducatorEducation: async (educator_id) => {
        let filter = educator_id;
        if (typeof educator_id !== 'object') {
            filter = { user_id: educator_id }
        }
        try {
            console.log(filter)
            const result = await models.education.findAll({
                where: filter,
                attributes: ['id', 'date', 'hours', 'client_number', 'education_status', 'contact_phone', 'contacted_date', 'education_type', 'address_id'],
                include: [
                    {model: models.salon_address, attributes: ['address']},
                ],
            });

            return result.map(function(item) {
                return item.toJSON();
            })

        }catch (error) {
            error.code=400
            throw error
        }

    },
    getEducatorBrands: async (educator_id) => {
        try {
            let result = await models.educator.findOne({
                where:{user_id:educator_id},
                attributes:['brand_id']
            })
            return result.toJSON();

        }catch (error) {
            error.code=400
            throw error
        }
    }












}