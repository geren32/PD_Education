const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');


router
    //region Products
    .post('/getAllProducts', productController.getAllProducts)

    .get('/getCategories', productController.getCategories)

module.exports = router;
