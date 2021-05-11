const express = require('express');
const router = express.Router();

const salonController = require('../controllers/salon.controller');

router
.get('/salesperson/:id', salonController.getSalesPerson)
.post('/createmessage', salonController.createMessage)
.get('/salonperson/:id', salonController.getSalonById)
.post('/salonperson', salonController.updateSalonById)
//#Region salon_address
.get('/salon_address',salonController.getSalonAddressById)
.post('/salon_address/:id',salonController.editSalonAddressById)
.post('/deletesalon_address/:id',salonController.deleteSalonAddressById)
////#endregion
////#region  salon_brands
.get('/salon_brands',salonController.checkSalonBrands)

module.exports= router;