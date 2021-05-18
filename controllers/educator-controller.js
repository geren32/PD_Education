const { models } = require('../sequelize-orm');
const config = require('../configs/config');
const educatorService = require('../services/educator.service');
const sequelize = require('../sequelize-orm');

module.exports = {

    GetAssignedTraining: async (req, res) => {



        try {

            let {user_id} = req.params;
            console.log(user_id)
            const result = await educatorService.GetAssignedTraining(user_id)

            result.forEach((element) => {
                if (element.finished_date) {
                    const thisDate = Math.floor(new Date().getTime() / 1000);
                    if (thisDate - 1 > element.finished_date) {
                        Object.assign(element,{'report':true})
                        console.log("86400")
                    }
                }
            })
            console.log(result)


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


            return res.render('client/educator',{
                result:result
            })

        } catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }



    },
    lessonConfirmation : async (req, res) => {
        try {
            let {id}= req.body.id
            console.log(id)

            const ready = await educatorService.lessonConfirmation(id);
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
                message: err.message,
                errCode: 400
            })
        }
    },
    createEducatorDate: async (req, res) => {
        try {
            let {user_id,availability} = req.body;

            if (!availability || !user_id) {
                res.status(403).json({
                    message: "виберіть дату"
                })
            }

                const result = await educatorService.recordingTheDate(user_id,availability)

            return res.json(result);
        } catch (err) {
            return res.status(400).json({
                message: err.message,
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
                message: err.message,
                errCode: 400
            })
        }

    },
    productForOrder: async (req,res) => {

        try{

            let {id,quantity,brand_id,user_id,address_id,salon_id} = req.body

            if (!quantity || !id || !brand_id || !user_id || !address_id || !salon_id) {

                res.status(403).json({ message: "Some field provided" });
            }
            let products = [id,quantity]

            products = JSON.stringify(products);

            const OrdersObj = {
                salon_id:salon_id,
                products:products,
                brand_id:brand_id,
                user_id:user_id,
                address_id:address_id,
                date:Math.floor(new Date().getTime() / 1000)
            }

            const result = await educatorService.productForOrder(OrdersObj)
            return result;


        } catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            })
        }
    },

    getEquipmentEducator: async (req,res) => {
        try {
            let {user_id} = req.body

            const result = await educatorService.getEquipmentEducator(user_id)

            return res.json(result);

        }catch (err) {
            return res.status(400).json({
                massage: err.massage,
                errCode: 400
            })
        }
    },
    changeRequestEquipmentEducator: async (req,res) => {
        try {
            let {user_id,id,text} = req.body

            if (!text || !id || !user_id){

                res.status(403).json({ message: "Some field provided" });
            }
            let BagObj ={
                status:config.REQUEST_STATUS.CONSIDERED,
                bag_id:id,
                user_id:user_id,
                text:text,
                date:Math.floor(new Date().getTime() / 1000),
            }

            const result = await educatorService.changeRequestEquipmentEducator(BagObj)

            return res.json(result);

        }catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            })
        }
    },
    createReportForEducation: async (req,res) => {
        try {
            let {user_id,text,id,days,invoice_file} = req.body

            if (!user_id || !text || !id || !days || !invoice_file){

                res.status(403).json({ message: "Some field provided" });
            }

            let ReportObj = {
                user_id:user_id,
                text:text,
                education_id:id,
                days:days,
                invoice_file:invoice_file,
            }

            const result = await educatorService.createReportForEducation(ReportObj)

            return res.json(result);

        }catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            })
        }
    },
    createEducationKilometers : async (req,res) => {
        try {
            let {id,education_id,kilometers,additional,invoice_file,user_id} = req.body

            if (!id || !education_id || !kilometers || !additional || !invoice_file || !user_id){
                res.status(403).json({ message: "Some field provided" });
            }
            let KilometersObj = {
                report_id:id,
                education_id:education_id,
                kilometers:kilometers,
                additional:additional,
                invoice_file:invoice_file,
                user_id:user_id,
            }

            const  result = await educatorService.createEducationKilometers(KilometersObj)

            return res.json(result);

        }catch (err){
            return res.status(400).json({
                message:err.message,
                errCode:400
            })
        }
    }

}
