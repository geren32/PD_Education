const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin-educator.controller')

router.post('/hoodOfAllEducatorForBrands',admin.hoodOfAllEducatorForBrands)
router.get('/createEducator',admin.createEducator)
router.get('/updateEducator',admin.updateEducator)
router.get('/deleteEducator',admin.deleteEducator)
router.post('/getEducatorDetails',admin.getEducatorDetails)





module.exports = router;