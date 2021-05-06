const express = require('express');
const router = express.Router();

const adminBookingController = require('../controllers/admin-booking.controller');
const validateTokenMiddleware = require('../middlewares/validate-token.middleware');
const checkSuperAdminMiddleware = require('../middlewares/check-super-admin-role.middleware');


router.use(validateTokenMiddleware, checkSuperAdminMiddleware);

router
    //region Booking
    .post('/getBookings', adminBookingController.getBookings)

    .get('/getBooking/:id', adminBookingController.getBookingById)

    .post('/deleteBookings', adminBookingController.deleteBookingByIds)

    .put('/changeBookingStatus', adminBookingController.changeBookingStatusById)

    .put('/updateBooking/:id', adminBookingController.updateBookingById)

    .put('/updateOrderKitComment/:id', adminBookingController.updateProductKitCommentById)
    //endregion

    // region Payment
    // .post('/getPayments', adminBookingController.getPayments)
    //
    // .get('/getPayment/:id', adminBookingController.getPaymentById)
    //
    // .delete('/deletePayment/:id', adminBookingController.deletePaymentById)
    //
    // .post('/editPayment/:id', adminBookingController.editPaymentById)
    //endregion

    // region Orders
    // .post('/getOrderByUser', adminBookingController.getOrderByUser)
    //
    // .post('/getOrdersByBookingId', adminBookingController.getOrdersByBookingId)
    //
    // .get('/getOrder/:id', adminBookingController.getOrderById)
    //
    // .delete('/deleteOrder/:id', adminBookingController.deleteOrderById)
//endregion

module.exports = router;
