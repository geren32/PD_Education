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
            title = JSON.stringify(title);
            // let brandsObj = {
            //     title:title,
            //     logo:logo
            // }
            const result = await adminBrandsService.checkForAvailability(title)
            console.log(result)


                if (result){
                    res.status(403).json({massage: "such a brand already exists"})
                }
            // else if (!result) {
            //
            //         let result = await adminBrandsService.createBrands(brandsObj);
            //     }
            // return res.json(result);



        } catch (err) {
            return res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }
    }



}