const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const Sequelize = require('sequelize');
const moment = require('moment');
const config = require('../configs/config');
const { Op } = Sequelize;


module.exports = {
    GetAssignedTraining: async (user_id) => {
        let filter = user_id;
        if (typeof user_id !== 'object') {
            filter = { user_id: user_id }
        }
       try {
           const result = await models.education.findAll({
               where: filter,
               attributes: ['id','date', 'hours', 'client_number', 'education_status', 'contact_phone', 'contacted_date', 'education_type','address_id'],


                    include: [
                        {model: models.salon_address, attributes: ['address'],}
                    ]
       });
           return result.map(function(item) {
               return item.toJSON();
           })

       }catch (error) {
           error.code=400
       }

    },
    lessonConfirmation: async (id) => {
        const read = await models.education.update({education_status:config.GLOBAL_STATUSES.ACTIVE ,
            contacted_date:Math.floor(new Date().getTime() / 1000),}, {where: { id: id }});
        return read;
    },

    checkForAvailability : async (user_id) =>{
        try {
            const auditDate = await models.educator.findAll({
                where:
                    {user_id: user_id}
            })
            return auditDate;

        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    recordingTheDate : async (user_id,createDate) =>{
        try {
                const result = await models.educator.update(
                    {date:createDate},
                    {where: {user_id:user_id}
                    })

                return result;
        }   catch (err) {
            err.code = 400;
            throw err;
        }
    },
    getProductsForTraining: async () => {
        try {
            let result = await models.products.findAll({
               attributes: ['id','title','price']
            })
            console.log(result)
            return result.map(function(item) {
                return item.toJSON();
            })

        }catch (error){
            error.code= 400
        }
    },
    returnIn7Days: async (user_id) => {
        try {

            let result = await models.education.findAll({
                where: {user_id:user_id},
                attributes:['id','contacted_date','education_status','created_date']
            })


            return result.map(function(item) {
                return item.toJSON();
            });


        } catch (error) {
            error.code = 400

        }
    },
    productForOrder:async (OrdersObj) => {
        try {
            console.log(OrdersObj)

            let result = await models.orders.create(
                OrdersObj
            )
            return result.toJSON();

        } catch (error) {
            error.code = 400


        }
    },
    getEquipmentEducator: async (user_id) => {
        try {
            let filter = user_id;
            if (typeof user_id !== 'object') {
                filter = { user_id: user_id }
            }
            let result = await models.bag_items.findAll({
                where:filter
                }

            )
            return result.map(function(item) {
                return item.toJSON();
            })



        }catch (error) {
            error.code = 400
        }
    },
    changeRequestEquipmentEducator: async (BagObj) => {
        try{

            let result = await models.bag_items_requests.create(BagObj)
            return result.toJSON();
        }catch (error) {
            error.code = 400
        }
    },
    createReportForEducation: async (ReportObj) => {
        try{

            let result = await models.education_report.create(ReportObj)
            return result.toJSON();

        }catch (error) {
            error.code = 400
        }
    },
    createEducationKilometers: async (KilometersObj) => {
        try {console.log(KilometersObj)
            let result = await models.education_kilometers.create(KilometersObj)
            return result.toJSON();

        }catch (error){
            error.code = 400
        }
    }




}