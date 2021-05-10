const { models } = require('../sequelize-orm');
const config = require('../configs/config');
const educatorService = require('../services/educator.service');
const sequelize = require('../sequelize-orm');

module.exports = {

    GetAssignedTraining: async (req, res) => {
        try {

            const result = await educatorService.GetAssignedTraining()
            return res.json(result);
            // res.render('client/cabinet/education', {
            //     DATE:date, Time:hours, NUMBER:client_number,
            //     status:education_status, contact:contact_phone,
            // })

        } catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }
    },
    getDatta: async (req, res) => {
        try {
            const result = await educatorService.getDatta(user_id)
            return  res.json(result);
        } catch (err) {
            return res.status(400).json({
                massage: err.massage,
                errCode: 400
            })
        }
    },

    getProductsForTraining: async (req, res) => {
        try {
            const result = await educatorService.getProductsForTraining()

        } catch (err) {
            return res.status(400).json({
                massage: err.massage,
                errCode: 400
            })
        }


    }
}