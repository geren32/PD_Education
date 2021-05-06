const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");



module.exports = {
    createModel: async (title) => {
        try {
            // log.info(`Start createModel. ${JSON.stringify(title)}`)
            let result = await models.model.create({title});
            // log.info(`End createModel. ${JSON.stringify(result)}`)
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    getModels: async  () =>  {
        try {
            // log.info(`Start getCategories.`)
            let result = await models.model.findAll({raw: true})
            // log.info(`Start getCategories.`)
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    getModelById: async (id) => {
        try {
            // log.info(`Start getModelById. ${JSON.stringify(id)}`)
            let result = await models.model.findOne({
                where: {id: id}
            })
            // log.info(`End getModelById. ${JSON.stringify(id)}`)
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    deleteModel: async (id) => {
        try {
            // log.info(`Start deleteModel. ${JSON.stringify(id)}`)
            let result = await models.model.destroy({
                where: {id: id}
            })
            // log.info(`End deleteModel. ${JSON.stringify(id)}`)
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    editModel: async (id, title) => {
        try {
            // log.info(`Start editModel. id - ${JSON.stringify(id)}, title - ${JSON.stringify(title)}`)
            await models.model.update({title}, {where: {id}})
            let result = await models.model.findOne({
                where: {id: id}
            })
            return result
            // log.info(`End editModel. id - ${JSON.stringify(id)}, title - ${JSON.stringify(title)}`)
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
}
