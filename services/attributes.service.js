const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");



module.exports = {
     createAttribute: async (attribute) => {
        try {
            // log.info(`Start createAttribute. ${JSON.stringify(attribute)}`)
            let result = await models.attribute.create(attribute);
            // log.info(`End createAttribute. ${JSON.stringify(attribute)}`)
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     getAttributes: async (ids) => {
        let where = {}
        if (ids) {
            where.id = ids;
        }
        try {
            //log.info(`Start getAttributes.`)
            let result = await models.attribute.findAll({
                raw: true,
                where: where
            })
            // log.info(`Start getAttributes.`)
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     getAttributeById: async (id) =>  {
        try {
            // log.info(`Start getAttributeById. ${JSON.stringify(id)}`)
            let result = await models.attribute.findOne({
                where: {id: id}
            })
            // log.info(`End getAttributeById. ${JSON.stringify(id)}`)
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     deleteAttribute: async (id) => {
        try {
            // log.info(`Start deleteAttribute. ${JSON.stringify(id)}`)
            await models.product_to_attribute.destroy({
                where: {attribute_id: id}
            })
            let result = models.attribute.destroy({
                where: {id: id}
            })
            // log.info(`End deleteAttribute. ${JSON.stringify(id)}`)
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    editAttribute: async(id, attribute) => {
        try {
            // log.info(`Start editAttribute. id - ${JSON.stringify(id)}, attribute - ${JSON.stringify(attribute)}`)
            await models.attribute.update(attribute, {where: {id}})
            let result = models.attribute.findOne({
                where: {id: id}
            })
            return result;
            // log.info(`End editManufacturer. id - ${JSON.stringify(id)}, attribute - ${JSON.stringify(attribute)}`)
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },



}
