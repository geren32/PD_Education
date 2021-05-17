const { models } = require('../sequelize-orm');
const config = require('../configs/config');
const adminBrandsService = require('../services/admin-brands.service');
const sequelize = require('../sequelize-orm');

module.exports = {
    createBrands: async (req, res) => {

        try {
            let {title,logo} = req.body
            if (!title || !logo ) {
                res.status(403).json({ message: "Some field provided" });
            }
            let brandsObj = {
                title:title,
                logo:logo
            }
            const result = await adminBrandsService.checkForAvailability(title)


                if (result){
                    res.status(403).json({massage: "such a brand already exists"})
                }
            else if (!result) {

                    let result = await adminBrandsService.createBrands(brandsObj);
                    return result;
                }
            return res.json(result);



        } catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }
    },
    updateBrands: async (req,res) => {
        try {
            let {id,title,logo} = req.body

            const result = await adminBrandsService.updateBrands(id,title,logo)
            return res.json(result);

        } catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }
    },
    deleteBrands : async (req,res) => {
        try {
            let {id} = req.body
            const result = await  adminBrandsService.deleteBrands(id)
            return res.json(result);

        } catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }
    }



}
