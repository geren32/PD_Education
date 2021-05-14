const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin-brands.controller')

router.get('/createBrands',admin.createBrands)





module.exports = router;