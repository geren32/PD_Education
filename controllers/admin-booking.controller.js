const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");
const addressService = require('../services/adress.service');
const bookingService = require('../services/booking.service');
const paymentService = require('../services/payment.service');
const ordersService = require('../services/order.service');
const productService = require('../services/product.service');
const variationService = require('../services/variation.service');
const userService = require('../services/user.service');
const config = require('../configs/config');
const errors = require('../configs/errors');
const { models, transaction } = require('../sequelize-orm');
const emailUtil = require('../utils/mail-util');
let currencyValue = 28;

async function currentUserCart (booking) {
    let result = null;
    if (booking) {
        let orders = await ordersService.getAllOrders({ booking_id: booking.id })
        let kits = await ordersService.getAllKitOrders({ booking_id: booking.id })
        let totalPrice = orders.reduce((total, order) => total + order.price, 0);
        if(kits && kits.length) {
            let totalKitPrice = kits.reduce((total, order) => total + order.price, 0);
            totalPrice += totalKitPrice;
        }
        totalPrice = totalPrice.toFixed(2);
        totalPrice = (totalPrice*currencyValue).toFixed(2);

        let totalAmount = orders.reduce((total, order) => total + order.count, 0) + kits.reduce((total,order) => total + order.count, 0);
        orders = JSON.parse(JSON.stringify(orders));
        let products = [];
        orders.forEach((order) => {
            order.price = (order.price*currencyValue).toFixed(2);
            order.product.price = (order.product.price*currencyValue).toFixed(2);
            order.product.product_variations[0].price = (order.product.product_variations[0].price*currencyValue).toFixed(2);
            products.push({
                order: order,
                product: order.product,
                variation: order.product.product_variations[0]
            })
            return order
        })
        let product_kits = [];
        for (let kit of kits) {
            kit.price = (kit.price*currencyValue).toFixed(2);
            kit.product_kit.price = (kit.product_kit.price*currencyValue).toFixed(2);
            let products = [];
            for (let product of JSON.parse(kit.products)) {
                let kit_products = {
                    info: product,
                    variation: await variationService.getVariationById(product.variation),
                    product: await productService.getProductById(product.product, false)
                }
                kit_products.variation.price = (kit_products.variation.price*currencyValue).toFixed(2);
                kit_products.product.price = (kit_products.product.price*currencyValue).toFixed(2);
                products.push(kit_products)
                kit.kit_products = products;
                kit.kit_price = kit.price/kit.count;
            }
            product_kits.push({
                order: kit,
                price: kit.price/kit.count,
                kit: kit.product_kit,
                products: products,
                productsJson: JSON.stringify(products)
            })
        }
        let priceWithDelivery;
        if(booking.delivery_price) {
            priceWithDelivery = totalPrice + booking.delivery_price;
        } else priceWithDelivery = totalPrice;
        result = {
            // kits: product_kits,
            // products: products,
            orders: {products: JSON.parse(JSON.stringify(orders)), kits: kits},
            totalPrice: priceWithDelivery,
            productsPrice: totalPrice,
            deliveryPrice: booking.delivery_price,
            totalAmount: totalAmount
        }
    } else result = 'кошик пустий'
    return result;
}


module.exports = {
    getBookings: async (req, res) => {
        let page = req.body.current_page ? parseInt(req.body.current_page) : null;
        let perPage = req.body.items_per_page ? parseInt(req.body.items_per_page) : null;
        let statusCount = await bookingService.countBookingsByParam();
        // Замінив на метод вище
        // let numberOfDeletedBookings = await bookingService.countBookingsByParam({ status: 0 });
        // let numberOfNewBookings = await bookingService.countBookingsByParam({ status: 1 });
        // let numberOfProcessedBookings = await bookingService.countBookingsByParam({ status: 2 });
        // let numberOfActiveBookings = await bookingService.countBookingsByParam({ status: 3 });
        // let numberOfCanceledBookings = await bookingService.countBookingsByParam({ status: 4 });
        // let numberOfFailedBookings = await bookingService.countBookingsByParam({ status: 5 });
        // let numberOfAllBookings = await bookingService.countBookingsByParam({ status: { [Op.ne]: 0 } });
        // let statusCount = {
        //     all: numberOfAllBookings,
        //     0: numberOfDeletedBookings,
        //     1: numberOfNewBookings,
        //     2: numberOfProcessedBookings,
        //     3: numberOfActiveBookings,
        //     4: numberOfCanceledBookings,
        //     5: numberOfFailedBookings
        // };

        let bookings = await bookingService.getAllBookings(req.body, page, perPage, currencyValue);
        // let bookings = await bookingService.getAllBookings({dealer_id, user_id, status, page: page, perPage: perPage});
        res.status(200).json( {count: bookings.count, data: bookings.rows, statusCount} );
        return
    },
    getBookingById: async (req, res) => {
        let booking = await bookingService.getBookingById(req.params.id)
        let result = null;
        if (booking) {
            booking = booking.toJSON()
            booking.cart = await currentUserCart(booking);
            result = booking
        }
        res.status(200).json(result);
        return
    },
    updateProductKitCommentById: async (req, res) => {
        let id = req.params.id;
        let {comment} = req.body;
        try {
            return res.status(200).json(await ordersService.editKitOrder({comment: comment}, id));
            // return order_kit;
        } catch (error) {
            res.status(400).json({
                message: error.message,
                errCode: ''
            });
            return
        }
    },
    updateBookingById: async (req, res) => {
        let id = req.params.id;
        let {status, first_name, last_name, phone, email, pay_type} = req.body;
        if(!id || !first_name || !last_name || !phone || !email || (!pay_type && pay_type != 0)) {
            res.status(errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code).json({
                message: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.message,
                errCode: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code,
            });
            return;
        }
        if (!config.REGEX_PHONE.test(phone) || phone.length != 19) {
            res.status(errors.BAD_REQUEST_USER_PHONE_NOT_VALID.code).json({
                message: errors.BAD_REQUEST_USER_PHONE_NOT_VALID.message,
                errCode: errors.BAD_REQUEST_USER_PHONE_NOT_VALID.code,
            });
            return;
        }
        if (!config.REGEX_EMAIL.test(email)) {
            res.status(errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.code).json({
                message: errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.message,
                errCode: errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.code,
            });
            return;
        }
        const transaction = await sequelize.transaction();
        try {
            let booking = await bookingService.getBookingById(id, transaction);
            if (!booking) {
                res.status(400).json({
                    message: errors.BAD_REQUEST_ID_NOT_FOUND.message,
                    errCode: errors.BAD_REQUEST_ID_NOT_FOUND.code
                });
                return
            }
            let sendMail;

            if(status !== booking.status) {
                let currentStatus = config.BOOKING_STATUSES[`${booking.status}`];
                let newStatus = config.BOOKING_STATUSES[`${status}`];
                sendMail = `Статус замовлення змінений з ${currentStatus} на ${newStatus}`;


                await bookingService.editBooking({status},id,transaction)


                bookingService.createBookingRevision({created_at: Math.floor(new Date().getTime() / 1000), booking_id: booking.id, message: `Статус замовлення змінений з ${currentStatus} на ${newStatus}`},transaction);
                // Замінив методом вище
                // await models.booking_revision.create({created_at: Date.now()/1000, booking_id: booking.id, message: `Статус замовлення змінений з ${currentStatus} на ${newStatus}`}, {transaction});
            }
            //  await booking.update({updatedAt: Date.now()/1000}, transaction);
             await bookingService.editBooking({updatedAt:Math.floor(new Date().getTime() / 1000)},{id:id},transaction)
            booking.address = await addressService.editAddress(booking.address_id, {first_name, last_name, phone, email, pay_type}, transaction);
            // await models.booking_history.create({created_at: Date.now()/1000, booking_id: booking.id, user_id: req.userid}, {transaction});
            await bookingService.createBookingHistory({created_at: Math.floor(new Date().getTime() / 1000), booking_id: booking.id, user_id: req.userid},transaction)
            booking = await bookingService.getBookingById(id, transaction);
            await transaction.commit();
            if(sendMail) {
                let mailObj = {
                    to: booking.address.email,
                    subject: 'Зміна статусу замовлення',
                    data: {
                        booking: booking,
                        info: sendMail
                    }
                };
                await emailUtil.sendMail(mailObj, 'change-booking-status');
            }
            booking = booking.toJSON()
            booking.cart = await currentUserCart(booking);

            return res.status(200).json(booking);

        } catch (error) {
            await transaction.rollback();
            res.status(400).json({
                message: error.message,
                errCode: ''
            });
            return
        }
    },
    changeBookingStatusById: async (req, res) => {
        let { id, status } = req.body;
        if(!id || !status) {
            res.status(errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code).json({
                message: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.message,
                errCode: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code,
            });
            return;
        }
        try {
            let booking = await bookingService.getBookingById(id);
            if (!booking) {
                res.status(errors.BAD_REQUEST_ID_NOT_FOUND.code).json({
                    message: errors.BAD_REQUEST_ID_NOT_FOUND.message,
                    errCode: errors.BAD_REQUEST_ID_NOT_FOUND.code,
                });
                return;
            }
            let currentStatus = config.BOOKING_STATUSES[`${booking.status}`];
            let newStatus = config.BOOKING_STATUSES[`${status}`];
            await bookingService.editBooking({ status: status, updatedAt: Math.floor(new Date().getTime() / 1000)},id);
            // await booking.update({ status: status, updatedAt: Date.now()/1000});
            await bookingService.createBookingHistory({created_at: Math.floor(new Date().getTime() / 1000), booking_id: booking.id, user_id: req.userid})
            // await models.booking_history.create({created_at: Date.now()/1000, booking_id: booking.id, user_id: req.userid});
            // await models.booking_revision.create({created_at: Date.now()/1000, booking_id: booking.id, message: `Статус замовлення змінений з ${currentStatus} на ${newStatus}`});
           await bookingService.createBookingRevision({created_at: Math.floor(new Date().getTime() / 1000), booking_id: booking.id, message: `Статус замовлення змінений з ${currentStatus} на ${newStatus}`});
            let mailObj = {
                to: booking.address.email,
                subject: 'Зміна статусу замовлення',
                data: {
                    booking: booking,
                    info: `Статус замовлення змінений з ${currentStatus} на ${newStatus}`
                }
            };
            await emailUtil.sendMail(mailObj, 'change-booking-status');
            return res.status(200).json(booking);

        } catch (error) {
            res.status(400).json({
                message: error.message,
                errCode: ''
            });
            return
        }
    },
    deleteBookingByIds: async (req, res) => {
        let { ids } = req.body;
        const transaction = await sequelize.transaction();
        try {
            let result = [];
            if (ids && ids.length) {
                for (let id of ids) {
                    let booking = await bookingService.getBookingById(id, transaction);
                    if (!booking) {
                        result.push({ id: id, deleted: false, error: `Не знайдено замовлення з id:${id}` })
                    }
                    if (booking && booking.status == 0) {
                        // await models.booking_revision.destroy({where: {booking_id: id}, transaction});
                        // await models.booking_history.destroy({where: {booking_id: id}, transaction});
                        // await models.booking_attachment.destroy({where: {booking_id: id}, transaction});
                        await bookingService.deleteBookingRevisionById(id,transaction);
                        await bookingService.deleteBookingHistoryById(id,transaction);
                        await bookingService.deleteBookingAttachmentById(id,transaction);
                        await ordersService.deleteOrderKit(id,transaction);
                        await ordersService.deleteOrder(id,transaction);
                        // await models.order_kits.destroy({where: {booking_id: id}, transaction});
                        // await models.orders.destroy({where: {booking_id: id}, transaction});
                        await booking.destroy({transaction});
                        result.push({ id: id, deleted: true, error: false });
                    } else {
                        await bookingService.editBooking({status:0},id,transaction);
                        // await booking.update({
                        //     status: 0,
                        // }, {transaction} );
                        result.push(booking);
                    }
                }
                await transaction.commit();
            }
            return res.status(200).json(result);

        } catch (error) {
            if(transaction) await transaction.rollback();
            res.status(400).json({
                message: error.message,
                errCode: ''
            });
            return
        }
    },

}
