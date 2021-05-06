const express = require('express');
const router = express.Router();


const validateCheck = require('../middlewares/validate-check.middleware');
const { check } = require('express-validator');
const adminImportController = require('../controllers/admin-import-product.controller');
const config = require('../configs/config');
const validateTokenMiddleware = require('../middlewares/validate-token.middleware');
const checkSuperAdminMiddleware = require('../middlewares/check-super-admin-role.middleware');
const { uploadPublicImage } = require('../utils/upload-util');

//router.use(validateTokenMiddleware, checkSuperAdminMiddleware);

router

    .get('/file', adminImportController.importProduct)





module.exports = router;
