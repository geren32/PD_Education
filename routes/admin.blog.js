const express = require('express');
const router = express.Router();


const validateCheck = require('../middlewares/validate-check.middleware');
const { check } = require('express-validator');
const adminBlogController = require('../controllers/admin-blog.controller');
const config = require('../configs/config');
const validateTokenMiddleware = require('../middlewares/validate-token.middleware');
const checkSuperAdminMiddleware = require('../middlewares/check-super-admin-role.middleware');
const { uploadPublicImage } = require('../utils/upload-util');

router.use(validateTokenMiddleware, checkSuperAdminMiddleware);

router

    .post('/createNews', adminBlogController.createNews)

    .post('/updateNews', adminBlogController.updateNewsById)

    .post('/getAllNews', adminBlogController.getAllNews)

    .get('/getNews/:id', adminBlogController.getNewsById)

    .post('/changeNewsStatus',
        [// Validate specific elements, sanitize them
            check('id').not().isEmpty().trim().isNumeric(),
            check('status').isIn([config.GLOBAL_STATUSES.ACTIVE, config.GLOBAL_STATUSES.WAITING, config.GLOBAL_STATUSES.DUPLICATE_POST]),
        ],
        validateCheck,
        adminBlogController.changeNewsStatusById)


    .post('/deleteNews', adminBlogController.deleteNewsByIds)



module.exports = router;
