const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const validateCheck = require('../middlewares/validate-check.middleware');
const adminProductController = require('../controllers/admin-product.controller');
const { uploadPublicImage } = require('../utils/upload-util');
const validateTokenMiddleware = require('../middlewares/validate-token.middleware');
const checkSuperAdminMiddleware = require('../middlewares/check-super-admin-role.middleware');

router.use(validateTokenMiddleware, checkSuperAdminMiddleware);

router
    //region Products
    .post('/createProduct',
        uploadPublicImage.fields([{name: 'image', maxCount: 1}, {name: 'gallery'}]),
        adminProductController.createProduct)

    .post('/getAllProducts', adminProductController.getAllProducts)

    .get('/getProduct/:id', adminProductController.getProductById)

    .post('/deleteProduct', adminProductController.deleteProduct)

    .post('/editProduct/:id',
        uploadPublicImage.fields([{name: 'image', maxCount: 1}, {name: 'gallery'}]),
        adminProductController.editProductById)

    .post('/changeProductStatus', adminProductController.changeProductStatus)

    .post('/createVariation',
        uploadPublicImage.fields([{name: 'gallery'}]),
        adminProductController.createVariation)

    .post('/editVariation/:id',
        uploadPublicImage.fields([{name: 'gallery'}]),
        adminProductController.editVariationById)

    .post('/deleteVariation', adminProductController.deleteVariation)

    .post('/changeVariationStatus', adminProductController.changeVariationStatus)
    //region Manufacturer

    .post('/createManufacturer', adminProductController.createManufacturer)

    .get('/getManufacturers', adminProductController.getManufacturers)

    .get('/getManufacturer/:id', adminProductController.getManufacturerById)

    .delete('/deleteManufacturer/:id', adminProductController.deleteManufacturerById)

    .post('/editManufacturer/:id', adminProductController.editManufacturerById)
    //endregion

    //region Models
    .post('/createModel', adminProductController.createModel)

    .get('/getModels', adminProductController.getModels)

    .get('/getModel/:id', adminProductController.getModelById)

    .delete('/deleteModel/:id', adminProductController.deleteModelById)

    .post('/editModel/:id', adminProductController.editModelById)
    //endregion

    //region Categories
    .post('/createCategory', [
            check('image').exists().not().isEmpty(),
            check('title').exists().not().isEmpty(),
        ],
        uploadPublicImage.single('image'),
        adminProductController.createCategory)

    .get('/getCategories', adminProductController.getCategories)

    .get('/getCategory/:id', adminProductController.getCategoryById)

    .delete('/deleteCategory/:id', adminProductController.deleteCategoryById)

    .post('/editCategory/:id', adminProductController.editCategoryById)
    //endregion

    //region Brand
    .post('/createBrand', adminProductController.createBrand)

    .get('/getBrands', adminProductController.createBrand)

    .get('/getBrand/:id', adminProductController.getBrandById)

    .delete('/deleteBrand/:id', adminProductController.deleteBrandById)

    .post('/editBrand/:id', adminProductController.editBrandById)
    //endregion

    //region Attribute
    .post('/createAttribute', adminProductController.createAttribute)

    .get('/getAttributes', adminProductController.getAttributes)

    .get('/getAttribute/:id', adminProductController.getAttributeById)

    .delete('/deleteAttribute/:id', adminProductController.deleteAttributeById)

    .post('/editAttribute/:id', adminProductController.editAttributeById)

    //endregion

module.exports = router;
