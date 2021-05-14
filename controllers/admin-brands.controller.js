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
            console.log(brandsObj)



        } catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }
    }



}