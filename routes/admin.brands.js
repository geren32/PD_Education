const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin-brands.controller')

router.get('/createBrands',admin.createBrands)
router.get('/updateBrands',admin.updateBrands)
router.get('/deleteBrands',admin.deleteBrands)





module.exports = router;