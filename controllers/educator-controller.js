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
        const id = req.params.id;
        if (!id) throw new Error('No id');

        const ready = await educatorService.alreadyTraining(id);
        res.json(true);

        const result = await educatorService.returnIn7Days(id);

        if (result.education_status !== config.GLOBAL_STATUSES.ACTIVE){
            new Date(+result.contact_date * 1000);
            if (result.contact_date >= result.contact_date * 44040192) {
                res.render('/', {
                    error: "you have not confirmed the lesson"
                });
            }
        }
        return res.json(result);
    },

            getDatta: async
        (req, res) => {
            try {
                const result = await educatorService.getDatta(user_id)
                return res.json(result);
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