const { models } = require('../sequelize-orm');
const config = require('../configs/config');
const educatorService = require('../services/educator.service');
const sequelize = require('../sequelize-orm');

module.exports = {

    GetAssignedTraining: async (req, res) => {
        try {

            const result = await educatorService.GetAssignedTraining()
            console.log(JSON.parse(JSON.stringify(result)))
            res.render('client/cabinet/education',)
            return res.json(result);
        } catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }
    },
    alreadyTraining: async (req, res) => {
        const id = req.params.id;
        if (!id) throw new Error('No id');

        const result = await educatorService.alreadyTraining(id);
         res.json(true);
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