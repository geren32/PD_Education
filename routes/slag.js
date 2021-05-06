const express = require('express');
const router = express.Router();
let slagController = require('../controllers/slag-controller');
let pagesController = require('../controllers/pages-controller');
slagController = new slagController();
pagesController = new pagesController();
const blogController = require('../controllers/blog.controller');
const { models } = require('../sequelize-orm');
/* GET home page. */

// router.get('/:slag', async function(req, res, next) {
//     let slag =  req.params.slag
//     let result = await slagController.getAllMenu(slag);
//
//         if(result)
//         {
//
//             let result_page = await pagesController.getPages(result.table_id)
//             if (result_page)  {
//                 res.render(`client/${result_page.template}`,{
//                     layout: 'client/layout-client.hbs',
//                     ...result_page
//                 });
//             }
//
//         }
//         else
//         {
//             next()
//         }
// })

router.get('/:slag(*)', async function(req, res, next) {
    let slag =  req.params.slag


    let result = await models.links.findOne({where: {slag: slag}});
    if(req.url == '/shop/product/checkout') {
        result ={}
        result.link = '/booking/checkout'
    }
    if(result)
    {
        req.url = result.link;
        next();
    }
    else
    {
        next()
    }
})

// router.get('/getPage/:slag', blogController.getPage)


module.exports = router;
