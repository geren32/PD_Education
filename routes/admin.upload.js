const express = require('express');
const router = express.Router();

const validateCheck = require('../middlewares/validate-check.middleware');
const adminUploadController = require('../controllers/admin-upload.controller');
const validateTokenMiddleware = require('../middlewares/validate-token.middleware');
const checkSuperAdminMiddleware = require('../middlewares/check-super-admin-role.middleware');
const { uploadPublicImage } = require('../utils/upload-util');

router.use(validateTokenMiddleware, checkSuperAdminMiddleware);

router
    .post('/uploadImage', uploadPublicImage.single('image'), adminUploadController.uploadImage)

    .post('/updateImage', adminUploadController.updateImage)

    .delete('/deleteImage/:id', adminUploadController.deleteImage)

    .post('/getImages', adminUploadController.getImages)




module.exports = router;
