const { models } = require('../sequelize-orm');
const config = require('../configs/config');
const adminEducatorService = require('../services/admin-educator.service');
const sequelize = require('../sequelize-orm');

module.exports = {
    hoodOfAllEducatorForBrands: async (req,res) => {
        try {
            let {brand_id} = req.body
            let result = await adminEducatorService.hoodOfAllEducatorForBrands(brand_id)
            return res.json(result);



        }catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }
    },
    createEducator : async (req,res) => {
    try {
        let {user_id,brand_id} = req.body;
        brand_id = JSON.stringify(brand_id);
        let EducatorObj = {
            user_id:user_id,
            brand_id:brand_id,
            date:Math.floor(new Date().getTime() / 1000),
        }
         let result = await  adminEducatorService.createEducator(EducatorObj)
        return result;



    }catch (err) {
        return res.status(400).json({
            message: err.message,
            errCode: 400
        });
    }
},
    updateEducator: async (req,res) => {
        try {
            let {id,brand_id} = req.body
            brand_id = JSON.stringify(brand_id);
            let result = await adminEducatorService.updateEducator(id,brand_id)
            return result;

        }catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }
    },
    deleteEducator : async (req,res) => {
        try {
            let {id} = req.body

            let result = await adminEducatorService.deleteEducator(id)
            return result;

        }catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }
    },
    getEducatorDetails: async (req,res) => {
        try {
            let {educator_id} = req.body
            const result = await  adminEducatorService.getEducatorEducation(educator_id)
                const ready = await adminEducatorService.getEducatorBrands(educator_id)
            return res.json(result);


        }catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }
    },






}