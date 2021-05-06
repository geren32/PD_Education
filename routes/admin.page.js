const express = require('express');
const router = express.Router();


const validateCheck = require('../middlewares/validate-check.middleware');
const { check } = require('express-validator');
const adminPageController = require('../controllers/admin-page.controller');
const config = require('../configs/config');
const validateTokenMiddleware = require('../middlewares/validate-token.middleware');
const checkSuperAdminMiddleware = require('../middlewares/check-super-admin-role.middleware');
const { uploadPublicImage } = require('../utils/upload-util');

router.use(validateTokenMiddleware, checkSuperAdminMiddleware);

router

    .post('/createPage', adminPageController.createPage)

    .post('/updatePage', adminPageController.updatePageById)

    .post('/getAllPages', adminPageController.getAllPages)

    .get('/getPage/:id', adminPageController.getPageById)

    .post('/changePageStatus',
        [// Validate specific elements, sanitize them
            check('id').not().isEmpty().trim().isNumeric(),
            check('status').isIn([config.GLOBAL_STATUSES.ACTIVE, config.GLOBAL_STATUSES.WAITING, config.GLOBAL_STATUSES.DUPLICATE_POST]),
        ],
        validateCheck,
        adminPageController.changePageStatusById)

    .post('/deletePages', adminPageController.deletePagesByIds)

    .post('/getAllDealersPages', adminPageController.getAllDealersPages)

    .post('/createDealerPage', adminPageController.createDealerPage)



module.exports = router;
