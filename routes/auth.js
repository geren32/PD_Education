const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/auth.controller');

// const passportMiddleware = require('../middlewares/passport.middlewares');


router
    .get('/register', controller.registerPage)

    .post('/register', controller.registerNewClient)

    .get('/registerConfirm/:token', controller.registerConfirm)

    // .get('/login/:error?', controller.loginPage)

    .post('/login', controller.userLogin)

    .get('/forgotPassword/:token', controller.forgotPasswordPage)

    .post('/forgotPassword', controller.forgotPassword)

    .post('/resetPassword', controller.resetPassword)

    //.get('/changePassword', passportMiddleware, controller.changePasswordPage)
    //.post('/changePassword', passportMiddleware, controller.changePassword)
    // .post('/changePasswordUPDATE', passportMiddleware, controller.changePasswordUPDATE)

    .get('/logout', controller.logout)

    .get('/checkIsEmailExist/:newEmail', controller.checkIsEmailExist)

    .get('/checkIsPhoneExist/:phone', controller.checkIsPhoneExist)



    // .post('/getAllRegion', controller.getAllRegion)

    // .post('/dealersOfRegion', controller.dealersOfRegion)


module.exports = router;
