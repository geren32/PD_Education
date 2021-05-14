const express = require('express');
const router = express.Router();


// const validateCheck = require('../middlewares/validate-check.middleware');
const { check } = require('express-validator');
const adminUserController = require('../controllers/admin-user.controller');
const config = require('../configs/config');
// const validateTokenMiddleware = require('../middlewares/validate-token.middleware');
// const checkSuperAdminMiddleware = require('../middlewares/check-super-admin-role.middleware');


// router.use(validateTokenMiddleware, checkSuperAdminMiddleware);

router
//
//     .get('/test', adminUserController.test)
//
//     .post('/register',
//         [// Validate specific elements, sanitize them
//             // check('email').exists().trim().isEmail().withMessage('Invalid email'),
//             check('type').not().isEmpty().isIn([  config.SUPER_ADMIN_ROLE, config.CLIENT_ROLE]),
//             // check('password').exists().matches(/^(?=^[^\s]{8,16}$)(?=.*\d.*)(?=.*[a-z].*)(?=.*[A-Z].*)(?=.*[!@#$%^&*()_\-+=]).*$/)
//             //     .trim()
//             //     .withMessage('Password mismatch pattern'),
//             // check('first_name').exists().not().isEmpty(),
//             // check('last_name').exists().not().isEmpty(),
//             // check('status').exists().not().isEmpty(),
//         ],
//         validateCheck,
//
//         adminUserController.adminCreateUser)
//
//     .post('/updateUser/:id',
//         [// Validate specific elements, sanitize them
//             check('type').isIn([ config.SUPER_ADMIN_ROLE, config.CLIENT_ROLE]),
//
//         ],
//         validateCheck,
//         adminUserController.adminUpdateUserById)
//
//     .post('/getAllUsers',
//         [// Validate specific elements, sanitize them
//             // check('type').isIn([config.SR_MANAGER_ROLE, config.DIALER_ROLE, config.BLUM_MANAGER_ROLE, config.SUPER_ADMIN_ROLE, config.CLIENT_ROLE]),
//             check('status').isIn(["all", config.GLOBAL_STATUSES.WAITING, config.GLOBAL_STATUSES.ACTIVE, config.GLOBAL_STATUSES.BLOCKED, config.GLOBAL_STATUSES.DELETED]),
//         ],
//         validateCheck,
//         adminUserController.getAllUsers)
//
//     .get('/getUser/:id', adminUserController.getUserById)
//
//     .post('/changeUserStatus',
//         [// Validate specific elements, sanitize them
//             check('id').not().isEmpty().trim().isNumeric(),
//             check('status').isIn([config.GLOBAL_STATUSES.ACTIVE, config.GLOBAL_STATUSES.BLOCKED]),
//         ],
//         validateCheck,
//         adminUserController.changeUserStatusById)
//
//     // .get('/deleteUser/:id', adminUserController.deleteUserById)
//
//     // .post('/dealersOfRegion', adminUserController.dealersOfRegion)
//
//     .post('/checkIsDataExist', adminUserController.checkIsDataExist)
//
//     // .post('/deleteUsers', adminUserController.deleteUsers)
//
//     .get('/passwordRecovery/:id', adminUserController.passwordRecovery)
//
//     // .post('/getSrManagersByRegion', adminUserController.getSrManagersByRegion)
//
//     .post('/checkCRMNumber', adminUserController.checkCRMNumber)
//
//     // .post('/getDealersByRegions', adminUserController.getDealersByRegions)
//
//     // .get('/getAllPositionActivity', adminUserController.getAllPositionActivity)
//
//     // .get('/getAllActivity', adminUserController.getAllActivity)
//
//     // .get('/getAllRegions', adminUserController.getAllRegions)
//
//     // .get('/slag', adminUserController.slag)
//
//
//
// module.exports = router;
