const express = require('express');
const router = express.Router();
const checkClientMiddleware = require('../middlewares/check-client-role.middleware');
const passportMiddleware = require('../middlewares/passport.middlewares');

const bookingController = require('../controllers/booking.controller');

router
    //region Address
    .post('/createAddress', bookingController.createAddress)

    .post('/getAddresses', bookingController.getAddresses)

    .get('/getAddress/:id', bookingController.getAddressById)

    .delete('/deleteAddress/:id', bookingController.deleteAddressById)

    .post('/editAddress/:id', bookingController.editAddressById)
    //endregion

    //region Booking
    .post('/createBooking', passportMiddleware, checkClientMiddleware, bookingController.createBooking)

    .get('/getBookings', bookingController.getBookings)

    .delete('/deleteBooking/:id', bookingController.deleteBookingById)

    .post('/editBooking/:id', bookingController.editBookingById)

    //endregion
    // region Payment
    .post('/createPayment', bookingController.createPayment)

    .get('/getPayments', bookingController.getPayments)

    .get('/getPayment/:id', bookingController.getPaymentById)
    //endregion

    // region Orders
    .post('/createOrder', bookingController.createOrder)

    .get('/getOrders', bookingController.getOrders)

    .get('/getOrder/:id', bookingController.getOrderById)

    .delete('/deleteOrder/:id', bookingController.deleteOrderById)

    .post('/editOrder/:id', bookingController.editOrderById)

    //endregion
    .post('/addProductToCart', passportMiddleware, checkClientMiddleware, bookingController.addProductToCart)

    .post('/addProductKitToCart', passportMiddleware, checkClientMiddleware, bookingController.addProductKitToCart)

    .get('/getCurrentCart', passportMiddleware, checkClientMiddleware, bookingController.getCurrentCart)

    .post('/addProductToCartAjax', passportMiddleware, checkClientMiddleware, bookingController.addProductToCartAjax)

    .post('/addProductKitToCartAjax', passportMiddleware, checkClientMiddleware, bookingController.addProductKitToCartAjax)

    // .get('/checkout', passportMiddleware, checkClientMiddleware, bookingController.getCurrentCheckout)

    .post('/deleteProductFromCart', passportMiddleware, checkClientMiddleware, bookingController.deleteProductFromCart)

    .post('/makeBooking', passportMiddleware, checkClientMiddleware, bookingController.makeBooking)

    .get('/getBooking/:id', bookingController.getBookingById)


module.exports = router;
