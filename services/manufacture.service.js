const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");



module.exports = {
     createManufacturer: async (title) => {
        try {

            let result = await models.manufacturer.create({title});

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     getManufacturers: async () => {
        try {

            let result = await models.manufacturer.findAll({raw: true})

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     getManufacturerById: async (id) =>  {
        try {

            let result = await models.manufacturer.findOne({
                where: {id: id}
            })

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     deleteManufacturer: async (id) => {
        try {
            // log.info(`Start deleteManufacturer. ${JSON.stringify(id)}`)
            let result = await models.manufacturer.destroy({
                where: {id: id}
            })
            // log.info(`End deleteManufacturer. ${JSON.stringify(id)}`)
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     editManufacturer: async (id, title) => {
        try {
            // log.info(`Start editManufacturer. id - ${JSON.stringify(id)}, title - ${JSON.stringify(title)}`)
            await models.manufacturer.update({title}, {where: {id}})
            let result = await models.manufacturer.findOne({
                where: {id: id}
            })
            return result
            // log.info(`End editManufacturer. id - ${JSON.stringify(id)}, title - ${JSON.stringify(title)}`)
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

}
