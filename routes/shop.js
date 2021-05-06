const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop-controller');
/* GET home page. */

router.get('/', function(req, res, next) {


    res.render('client/shop/catalog', {
        metaData: req.body.metaData,
        layout: 'client/layout-client.hbs',

    });

})
    .get('/catalog/:id(*)', shopController.getAllProducts)
    .post('/catalog/:id', shopController.getAllProductsAjax)



    // .get('/catalog', shopController.getCategories)

    .get('/product/:slag', shopController.getProductById )


    // .get('/category-kit/:slag', function(req, res, next) {
    //
    //     res.render('client/shop/categories', {
    //         metaData: req.body.metaData,
    //         layout: 'client/layout-client.hbs',
    //     });
    //
    //
    // })

    .get('/product-kit/:slag', shopController.getProductKitById )
    // .get('/catalog-kit', shopController.getCategoriesKit)

    .get('/catalog-kit/:slag', shopController.getAllProductsKit)
    .post('/catalog-kit/:slag', shopController.getAllProductsKitAjax)

    .post('/catalog-kit/:id', shopController.getAllProductsAjax)

module.exports = router;
