const express = require('express');
const router = express.Router();

const salonController = require('../controllers/salon.controller');

router
.get('/salesperson', salonController.getSalesPerson)
.post('/createmessage', salonController.createMessage)
.get('/salonperson/:id', salonController.getSalonById)
.post('/salonperson', salonController.updateSalonById)
//#Region salon_address
.get('/salon_address',salonController.getSalonAddressById)
.post('/salon_address/:id',salonController.editSalonAddressById)
.post('/deletesalon_address/:id',salonController.deleteSalonAddressById)
//#endregion
//#region  salon_brands
.get('/salon_brands',salonController.checkSalonBrands)
.get('/brand_promotions',salonController.checkPromotionsofBrands)
////#endregion
//#region materials
.get('/salon_materials',salonController.getMaterials)
.get('/material_cat',salonController.getMaterialsCatById)
//#endregion
.get('/sales_person_brands',salonController.getBrandsSalesPerson)
.get('/product',salonController.getProducts)
//#region ProductOrder
.post('/makeorder',salonController.productForOrder)
module.exports= router;