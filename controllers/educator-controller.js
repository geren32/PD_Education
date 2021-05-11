const { models } = require('../sequelize-orm');
const config = require('../configs/config');
const educatorService = require('../services/educator.service');
const sequelize = require('../sequelize-orm');

module.exports = {

    GetAssignedTraining: async (req, res) => {
        try {
            let {user_id} = req.body;
            const result = await educatorService.GetAssignedTraining(user_id)
            console.log(JSON.parse(JSON.stringify(result)))
            return res.json(result);
            // res.render('client/cabinet/education',)
        } catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }
        // const id = req.params.id;
        // if (!id) throw new Error('No id');

        const ready = await educatorService.alreadyTraining(id);
        res.json(true);
        return ready;

        const reload = await educatorService.returnIn7Days(id);
        if (reload.education_status !== config.GLOBAL_STATUSES.ACTIVE){
            const thisDate = Math.floor(new Date().getTime() / 1000);
            if ( thisDate + 44040192 > reload.contacted_date) {
                res.render('/', {
                    error: "you have not confirmed the lesson"
                });
            }
        }
        return res.json(reload);
    },

            getDatta: async (req, res) => {
            try {
                let {user_id} = req.body;
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