const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");



module.exports = {
     createCategory: async (category) => {
        try {
            // log.info(`Start createCategory. ${JSON.stringify(category)}`)
            let result = await models.product_category.create(category);
            // log.info(`End createCategory. ${JSON.stringify(result)}`)
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     getCategories: async (admin) => {
        try {
            // log.info(`Start getCategories.`)
            let result = await  models.product_category.findAll({raw: true})
            let include = {}
            if (!admin) {
                include = [
                    {
                        model:  models.product, as: 'product', attributes: [],
                        where: {status: 2},
                        through: {attributes: []}
                    }
                ]
            } else {
                include = [
                    {
                        model:  models.product, as: 'product', attributes: [],
                        through: {attributes: []}
                    }
                ]
            }
            return  models.product_category.findAll({
                include: include
            });
            // log.info(`End getCategories.`)
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     getCategoryById: async (id) => {
        try {
            // log.info(`Start getCategoryById. ${JSON.stringify(id)}`)
            let result = await  models.product_category.findOne({
                where: {id: id}
            })
            // log.info(`End getCategoryById. ${JSON.stringify(id)}`)
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     deleteCategory: async (id) =>  {
        try {
            // log.info(`Start deleteCategory. ${JSON.stringify(id)}`)
            await  models.product_to_category.destroy({
                where: {product_category_id: id}
            })
            let result = await  models.product_category.destroy({
                where: {id: id}
            })
            // log.info(`End deleteCategory. ${JSON.stringify(id)}`)
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     editCategory: async(id, title) => {
        try {
            // log.info(`Start editCategory. id - ${JSON.stringify(id)}, title - ${JSON.stringify(title)}`)
            await  models.product_category.update({title}, {where: {id}})
            let result = await  models.product_category.findOne({
                where: {id: id}
            })
            return result
            // log.info(`End editCategory. id - ${JSON.stringify(id)}, title - ${JSON.stringify(title)}`)
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
}
