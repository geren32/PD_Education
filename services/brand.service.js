const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");


module.exports = {
     createBrand: async (brand) => {
        try {
            let result = await models.brand.create(brand);
            result = await models.brand.findOne({
                where: {id: result.id},
                attributes: ['id', 'title'],
                include: [
                    {model: models.manufacturer, as: "manufacturer", attributes: ['title', 'id']}
                ]
            })
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     getBrands: async (ids) => {
        let where = {}
        if (ids) {
            where.id = ids;
        }
        try {

            let result = await models.brand.findAll({
                where: where,
                include: [{model: models.manufacturer, as: "manufacturer", attributes: ['title']}]
            })

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     getBrandById: async(id) => {
        try {

            let result = await models.brand.findOne({
                where: {id: id},
                include: [{model: models.manufacturer, as: "manufacturer", attributes: ['title']}]
            })

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     deleteBrand: async (id) => {
        try {

            let result = await models.brand.destroy({
                where: {id: id}
            })

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     editBrand: async (id, title) => {
        try {

            await models.brand.update({title}, {where: {id}})
            let result = await models.brand.findOne({
                where: {id: id},
                include: [{model: models.manufacturer, as: "manufacturer", attributes: ['title']}]
            })
            return result

        } catch (err) {
            err.code = 400;
            throw err;
        }
    },


}
