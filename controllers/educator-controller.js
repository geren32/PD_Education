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

            const reload = await educatorService.returnIn7Days(user_id);

            reload.forEach((element) => { if (!element.contacted_date) {


                const thisDate = Math.floor(new Date().getTime() / 1000);
                if (thisDate - 44040192 > element.created_date) {
                    console.log('7 днів +- 44040192 ')
                    console.log(JSON.parse(JSON.stringify(element)))
                    return reload;

                }
            }
            })
            return res.json(result);


        } catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }



    },
    lessonConfirmation : async (req, res) => {
        try {
            let {id} = req.body

            const ready = await educatorService.alreadyTraining(id);
            res.json(true);
            return ready;

        } catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }
    },

    getEducatorData: async (req, res) => {
        try {
            let {user_id} = req.body;
            const result = await educatorService.checkForAvailability(user_id)
            if (result.length === 0 ){
console.log('select a date')
            }
            return res.json(result);
        } catch (err) {
            return res.status(400).json({
                massage: err.massage,
                errCode: 400
            })
        }
    },
    createEducatorDate: async (req, res) => {
        try {
            let {user_id,date} = req.body;
            console.log(date)
            if (!date){
                console.log('виберіть дату')
            }
                let createDate = [date]

                if (createDate.length === 0) {
                    console.log('пуста дата')
                }
                const result = await educatorService.recordingTheDate(user_id,createDate)

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
            return res.json(result);

        } catch (err) {
            return res.status(400).json({
                massage: err.massage,
                errCode: 400
            })
        }

    },
    productForOrder: async (req,res) => {
        try{
            let {id,quantity,brand_id,user_id,address_id} = req.body
            if (!quantity) {
                throw  new Error('please specify quantity')
            }
            let products = [id,quantity]
            const  result = await educatorService.productForOrder(products,brand_id,user_id,address_id)
            return result;


        } catch (err) {
            return res.status(400).json({
                massage: err.massage,
                errCode: 400
            })
        }
    }
}
