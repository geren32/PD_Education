const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const addressService = require('../services/adress.service');
const bookingService = require('../services/booking.service');
const paymentService = require('../services/payment.service');
const ordersService = require('../services/order.service');
const productService = require('../services/product.service');
const variationService = require('../services/variation.service');
const userService = require('../services/user.service');

const templateUtil = require('../utils/template-util');
let configs = require('../configs/config');
const emailUtil = require('../utils/mail-util');
const moment = require('moment');
let currencyValue = 28;

async function currentUserCart (currentCart, order, kit) {
    let result = null;
    if (currentCart) {
        let orders = order;
        let kits = kit;
        // let orders = await ordersService.getAllOrders({ cart_id: currentCart.id })
        // let kits = await ordersService.getAllKitOrders({ cart_id: currentCart.id })
        let totalPrice = orders.reduce((total, order) => total + order.price, 0);
        if(kits && kits.length) {
            let totalKitPrice = kits.reduce((total, order) => total + order.price, 0);
            totalPrice += totalKitPrice;
        }
        totalPrice = totalPrice.toFixed(2);
        totalPrice = (totalPrice*currencyValue).toFixed(2);
        // if(currency == 0) {
        //     totalPrice = (totalPrice*currencyValue).toFixed(2);
        // }

        let totalAmount = orders.reduce((total, order) => total + order.count, 0) + kits.reduce((total,order) => total + order.count, 0);
        orders = JSON.parse(JSON.stringify(orders));
        let products = [];
        orders.forEach((order) => {
            order.price = (order.price*currencyValue).toFixed(2);
            order.product.price = (order.product.price*currencyValue).toFixed(2);
            order.product.product_variations[0].price = (order.product.product_variations[0].price*currencyValue).toFixed(2);
            // if(currency == 0) {
            //     order.price = (order.price*currencyValue).toFixed(2);
            //     order.product.price = (order.product.price*currencyValue).toFixed(2);
            //     order.product.product_variations[0].price = (order.product.product_variations[0].price*currencyValue).toFixed(2);
            // }
            products.push({
                order: order,
                product: order.product,
                variation: order.product.product_variations[0]
            })
            return order
        })
        let product_kits = [];
        for (let kit of kits) {
            // if(currency == 0) {
            //     kit.price = (kit.price*currencyValue).toFixed(2);
            //     kit.product_kit.price = (kit.product_kit.price*currencyValue).toFixed(2);
            // }
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
                // if(currency == 0) {
                //     kit_products.variation.price = (kit_products.variation.price*currencyValue).toFixed(2);
                //     kit_products.product.price = (kit_products.product.price*currencyValue).toFixed(2);
                // }
                products.push(kit_products)
                kit.kit_products = products;
            }
            product_kits.push({
                order: kit,
                price: kit.price/kit.count,
                kit: kit.product_kit,
                // kit: await productService.getProductKitById(kit.product_kit_id),
                products: products,
                productsJson: JSON.stringify(products)
            })
        }
        result = {
            kits: product_kits,
            products: products,
            orders: {products: JSON.parse(JSON.stringify(orders)), kits: kits},
            totalPrice: totalPrice,
            totalAmount: totalAmount
        }
    } else result = 'Basket empty'
    return result;
}


module.exports = {

    createAddress: async (req, res) => {
        let { street, apartment, entrance, floor, intercom, district, city, country, last_name, first_name, email, phone } = req.body;
        //TODO:Add validation for status, popular, novelty, promotional (true/false)
        if (!street || !apartment || !entrance || !floor || !intercom || !district || !city || !country || !last_name || !first_name || !email || !phone) {
            return res.status(403).json({ message: "Some field provided" });

        }
        let newAddress = await addressService.createAddress({
            street,
            apartment,
            entrance,
            floor,
            intercom,
            district,
            city,
            country,
            last_name,
            first_name,
            email,
            phone
        });

      return  res.status(200).json({ newAddress });

    },

    getAddresses: async (req, res) => {
        //TODO: Add pagination
        let product = await addressService.findAllAddress();
      return  res.status(200).json(product);

    },

    getAddressById: async (req, res) => {
        let id = req.params.id
        if (!id) {
          return  res.status(403).json({ message: "Address id not provided" });

        }
        let result = await addressService.getAddressById(id);
       return res.status(200).json(result);

    },

    deleteAddressById: async (req, res) => {
        let id = req.params.id
        if (!id) {
          return  res.status(403).json({ message: "Address id not provided" });

        }
        let result = await addressService.deleteAddressById(id);
       return res.status(200).json(result);

    },

    editAddressById: async (req, res) => {
        let id = req.params.id;
        let { street, apartment, entrance, floor, intercom, district, city, country } = req.body;
        if (!id) {
           return res.status(403).json({ message: "Address id or title not provided" });

        }
        let result = await addressService.editAddress(id, {
            street,
            apartment,
            entrance,
            floor,
            intercom,
            district,
            city,
            country
        });
       return res.status(200).json(result);

    },

    createBooking: async (req, res) => {
        // console.log(Math.floor(new Date().getTime() / 1000));
        let { date, total_price, user_id, address_id, status } = req.body;
        //TODO:Add validation for status (true/false)
        if (!date || !total_price || !user_id || !address_id) {
            return res.status(403).json({ message: "Some field provided" });

        }
        let result = await bookingService.createBooking({ date, total_price, user_id, address_id, status });
      return  res.status(200).json(result);

    },

    getBookings: async (req, res) => {
        let user_id = req.userid;
        //TODO: Add pagination
        let result = await bookingService.getAllBookings({ user_id });
      return  res.status(200).json(result);

    },

    // getBookingById: async (req, res) => {
    //     let id = req.params.id
    //     if (!id) {
    //         res.status(403).json({ message: "Booking id not provided" });
    //         return;
    //     }
    //     let result = await bookingService.getBookingById(id);
    //     res.status(200).json(result);
    //     return
    // },

    deleteBookingById: async (req, res) => {
        let id = req.params.id
        if (!id) {
          return   res.status(403).json({ message: "Booking id not provided" });

        }
        let result = await bookingService.deleteBooking(id);
      return  res.status(200).json(result);

    },

    editBookingById: async (req, res) => {
        let id = req.params.id
        let { total_price, user_id, address_id, status } = req.body;
        let date = Math.floor(new Date().getTime() / 1000)
        if (!id) {
         return   res.status(403).json({ message: "Booking id not provided" });

        }
        let result = await bookingService.editBooking({ date, total_price, user_id, address_id, status }, id);
       return res.status(200).json(result);

    },

    createPayment: async (req, res) => {
        let { user_id, booking_id, price, status, date, service_name } = req.body;
        //TODO:Add validation for status (true/false)
        if (!user_id || !booking_id || !price || !date || !service_name) {
          return  res.status(403).json({ message: "Some field not provided" });

        }
        let result = await paymentService.createPayment({ user_id, booking_id, price, status, date, service_name });
        return res.status(200).json(result);

    },

    getPayments: async (req, res) => {
        //TODO: Add pagination
        let user_id = req.userid || req.headers.userid;
        let result = await paymentService.getAllPayments({ user_id });
      return  res.status(200).json(result);

    },

    getPaymentById: async (req, res) => {
        let id = req.params.id
        if (!id) {
          return  res.status(403).json({ message: "Payment id not provided" });

        }
        let result = await paymentService.getPaymentById(id);
      return  res.status(200).json(result);

    },

    createOrder: async (req, res) => {
        let { type, product_ids, booking_id, price, count } = req.body;
        //TODO:Add validation for status (true/false)
        if (!type || !product_ids || !booking_id || !price || !count) {
         return   res.status(403).json({ message: "Some field not provided" });

        }
        let result = await ordersService.createOrder({ type, booking_id, price, count }, product_ids);
       return res.status(200).json(result);

    },

    getOrders: async (req, res) => {
        //TODO: Add pagination
        let result = await ordersService.getAllOrders();
       return res.status(200).json(result);

    },

    getOrderById: async (req, res) => {
        let id = req.params.id
        if (!id) {
          return  res.status(403).json({ message: "Order id not provided"});

        }
        let result = await ordersService.getOrderById(id);
       return res.status(200).json(result);

    },

    deleteOrderById: async (req, res) => {
        let id = req.params.id
        if (!id) {
           return res.status(403).json({ message: "Order id not provided"});

        }
        let result = await ordersService.deleteOrder(id);
        return res.status(200).json(result);

    },

    editOrderById: async (req, res) => {
        let id = req.params.id
        let { type, product_id, booking_id, price, count } = req.body;
        if (!id) {
          return  res.status(403).json({ message: "Order Id not provided"});

        }
        let result = await ordersService.editOrder({ type, product_id, booking_id, price, count }, id);
        return res.status(200).json(result);

    },

    changeProductCountInCart: async (req, res) => {
        let userId = req.headers.userid || req.userid;
        let { count, order_id } = req.body;
        let order = await ordersService.getOrderById(order_id)
        //let product = await mysqlClient.getProductById(order.product_id, false)
        let variation = await variationService.getVariationById(order.variation_id)
        let lessAfter = variation.quantity + (order.count - count)
        if (lessAfter < 0) {
           return res.status(403).json("Count more than variation.quantity");

        }

        await variationService.editVariation(order.variation_id, { quantity: variation.quantity + (order.count - count) })
        let price = variation.price * count
        await ordersService.editOrder({ price, count }, order_id);
        let orders = await ordersService.getAllOrders({ booking_id: order.booking_id })
        let totalPrice = orders.reduce((total, order) => total + order.price, 0);
        let totalAmount = orders.reduce((total, order) => total + order.count, 0);
        let result = {
            orders: orders,
            totalPrice: totalPrice,
            totalAmount: totalAmount
        }
        return res.status(200).json(result);

    },

    // deleteProductFromCart: async (req, res) => {
    //     let userId = req.headers.userid || req.userid;
    //     let { order_id } = req.body;
    //     let booking = await bookingService.getCurrentBooking({ user_id: userId, status: 1 })
    //     let order = await ordersService.getOrderById(order_id);
    //     let variation = await variationService.getVariationById(order.variation_id)
    //     const transaction = await sequelize.transaction();
    //     await ordersService.deleteOrder(order_id, transaction);
    //     await variationService.editVariation(order.variation_id, { quantity: variation.quantity + order.count }, transaction)
    //     let orders = await ordersService.getAllOrders({ booking_id: booking.id }, transaction)
    //     let totalPrice = orders.reduce((total, order) => total + order.price, 0);
    //     let totalAmount = orders.reduce((total, order) => total + order.count, 0);
    //     let result = {
    //         orders: orders,
    //         totalPrice: totalPrice,
    //         totalAmount: totalAmount
    //     }
    //     if (orders.length == 0) {
    //         await bookingService.deleteBooking(booking.id, transaction)
    //     }
    //     await transaction.commit();
    //     res.status(200).json(result);
    //     return
    // },

    // makeOrder: async (req, res) => {
    //     let currentUserId = req.headers.userid || req.userid;
    //     let { address } = req.body;
    //     let booking = await bookingService.getCurrentBooking({ user_id: currentUserId, status: 1 })
    //     //Update address booking
    //     const transaction = await sequelize.transaction();
    //     await addressService.editAddress(booking.address_id, address, transaction)
    //     await bookingService.editBooking({ status: 2 }, booking.id, transaction)
    //     await transaction.commit();
    //     let result = await bookingService.getBookingById(booking.id)
    //     res.status(200).json(result);
    //     return
    // },


    makeBooking: async (req, res) => {
        let currency = req.currency;
        let currentUserId = req.user.userid;
        let { comment, street, department, apartment, house, district, city, last_name, first_name, email, phone, pay_type, delivery_type, delivery_price } = req.body;
        // if(!first_name || !last_name || !phone || !pay_type || !delivery_type || !city) throw new Error('Поле відсутнє')
        if(!first_name || !last_name || !phone || !pay_type || !delivery_type) return res.json('Поле відсутнє')
        let client = await userService.getClientById({user_id:currentUserId});
        // await models.client.findOne({where: {user_id: currentUserId}});

        let currentCart = await bookingService.getCurrentCart({ user_id: currentUserId, status: 1 })
        // if(!currentCart) throw new Error('Кошик пустий')
        if(!currentCart) return res.json('Кошик пустий')
        let newAddress = await addressService.createAddress({
            street,
            department,
            house,
            apartment,
            district,
            city,
            last_name,
            first_name,
            email,
            phone,
            pay_type,
            delivery_type
        });

        const transaction = await sequelize.transaction();
        let booking = await bookingService.createBooking({
            date: Math.floor(new Date().getTime() / 1000),
            total_price: currentCart.total_price,
            user_id: currentUserId,
            status: 1,
            comment: comment,
            address_id: newAddress.id,
            dealer_id: client.dealer_id,
            createdAt: Math.floor(new Date().getTime() / 1000),
            updatedAt: Math.floor(new Date().getTime() / 1000),
            delivery_price: delivery_price
        }, transaction)
        await currentCart.update({status: 2}, transaction);
        // let result = await bookingService.getBookingById(booking.id, transaction)
        let result;
        if (booking) {
            let orders = await ordersService.getAllOrders({ cart_id: currentCart.id })
            let kits = await ordersService.getAllKitOrders({ cart_id: currentCart.id })
            let totalPrice = orders.reduce((total, order) => total + order.price, 0);
            if(kits && kits.length) {
                let totalKitPrice = kits.reduce((total, order) => total + order.price, 0);
                totalPrice += totalKitPrice;
                for (let kit of kits) {
                    await ordersService.editKitOrder({booking_id: booking.id}, kit.id, transaction);
                }
                // for (let kit of kits) {
                //     await ordersService.editKitOrder({booking_id: booking.id}, kit.id, transaction);
                //     kit.products = JSON.parse(kit.products);
                //     // kit.info = await productService.getProductKitById(kit.product_kit_id);
                //     for (let product of kit.products) {
                //         kit.products_info = await productService.getProductById(product.product);
                //     }
                // }
            }
            if(orders && orders.length) {
                for (let order of orders) {
                    await ordersService.editOrder({booking_id: booking.id}, order.id, transaction);
                }
            }
            totalPrice = totalPrice.toFixed(2);
            // for (let order of orders) {
            //     order.info = await productService.getProductById(order.product_id);
            // }
            let totalAmount = orders.reduce((total, order) => total + order.count, 0) + kits.reduce((total,order) => total + order.count, 0);

            let cart = await currentUserCart(currentCart, orders, kits);
            booking = JSON.parse(JSON.stringify(booking));
            // booking.createdAt = new Date(booking.createdAt*1000).toLocaleString();
            // booking.createdAt = booking.createdAt.split('T')[0].replace(/-/g,'.');
            booking.createdAt = moment().format('DD.MM.YYYY, HH:mm');
            booking.address.delivery = configs.DELIVERY_TYPES[booking.address.delivery_type]
            booking.address.pay = configs.PAY_TYPES[booking.address.pay_type]

            let html = await templateUtil.getTemplate(
                {
                    // currency: currency,
                    cart: cart,
                    booking: booking
                }, 'client/shop/order-list');
            let mailObj = {
                to: email,
                subject: 'Ваше замовлення',
                data: {
                    // currency: currency,
                    cart: cart,
                    booking: booking
                }
            };
            await emailUtil.sendMail(mailObj, 'booking');

            result = {
                // orders: orders,
                html: html,
                booking: booking,
                orders: {products: orders, kits: kits},
                totalPrice: totalPrice,
                totalAmount: totalAmount
            }
        }
        await transaction.commit();
        const id = req.user ? req.user.userid : null;
        let dealerHeader;
        let user;
        if(id){
            // user = await dealerService.getClientDetail(id);
            // dealerHeader = await dealerService.getDealerUser(user.client.dealer_id);
        }

        const renderHeader = req.user ? 'client/layout-client-after-login.hbs' : 'client/layout-client.hbs';

        // let result = {
        //     // orders: orders,
        //     orders: {products: orders, kits: kits},
        //     totalPrice: totalPrice,
        //     totalAmount: totalAmount,
        //     html: html,
        //     cart_html: cart_html
        // }
        return res.json(result)
        // return res.json('client/shop/order-list', {
        //     layout: renderHeader,
        //     dealerData: dealerHeader, //in header
        //     title: "BLUM :: order-list",
        //     result: result,
        //     total_price: result.totalPrice,
        //     total_amount: result.totalAmount,
        //     first_name: user ? user.first_name : null,
        //     last_name: user ? user.last_name : null,
        //     cart: result ? result : null
        // });
        // return
    },

    getBookingById: async (req, res) => {
        let userId = req.userid;
        userId = req.headers.userid;
        let booking = await bookingService.getBookingById(req.params.id)
        // let booking = await bookingService.getCurrentCart({ user_id: userId, status: 1 })
        let result = null;
        if (booking) {
            let orders = await ordersService.getAllOrders({ booking_id: booking.id })
            let kits = await ordersService.getAllKitOrders({ booking_id: booking.id })
            let totalPrice = orders.reduce((total, order) => total + order.price, 0);
            if(kits && kits.length) {
                let totalKitPrice = kits.reduce((total, order) => total + order.price, 0);
                totalPrice += totalKitPrice;
                for (let kit of kits) {
                    kit.products = JSON.parse(kit.products);
                    // kit.info = await productService.getProductKitById(kit.product_kit_id);
                    for (let product of kit.products) {
                        kit.products_info = await productService.getProductById(product.product);
                    }
                }
            }
            totalPrice = totalPrice.toFixed(2);
            // for (let order of orders) {
            //     order.info = await productService.getProductById(order.product_id);
            // }
            let totalAmount = orders.reduce((total, order) => total + order.count, 0) + kits.reduce((total,order) => total + order.count, 0);
            result = {
                // orders: orders,
                booking: booking,
                orders: {products: orders, kits: kits},
                totalPrice: totalPrice,
                totalAmount: totalAmount
            }
        }

       return res.status(200).json(result);

    },

    deleteProductFromCart: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            let currency = req.currency;
            let userId = req.user.userid;
            // let userId = 257;
            let { order_id, order_kit_id } = req.body;
            let currentCart = await bookingService.getCurrentCart({ user_id: userId, status: 1 })
            if (!currentCart) return res.json('Basket empty')
            if(order_id) {
                let order = await ordersService.getOrderById(order_id);
                if(!order) return res.json('No order')
                // let variation = await variationService.getVariationById(order.variation_id)
                await ordersService.deleteOrder(order_id, transaction);
                // await variationService.editVariation(order.variation_id, { quantity: variation.quantity + order.count }, transaction)
            } else if(order_kit_id) {
                let order = await ordersService.getOrderKitById(order_kit_id);
                if(!order) return res.json('No order')
                for (let product of JSON.parse(order.products)) {
                    // let variation = await variationService.getVariationById(product.variation)
                    // await variationService.editVariation(product.variation, { quantity: variation.quantity + product.count }, transaction)
                }
                await ordersService.deleteOrderKit(order_kit_id, transaction);
            }
            let orders = await ordersService.getAllOrders({ cart_id: currentCart.id }, transaction)
            let kits = await ordersService.getAllKitOrders({ cart_id: currentCart.id }, transaction)
            let totalPrice = orders.reduce((total, order) => total + order.price, 0);
            if(kits && kits.length) {
                let totalKitPrice = kits.reduce((total, order) => total + order.price, 0);
                totalPrice += totalKitPrice;

                // for (let kit of kits) {
                //     kit.products = JSON.parse(kit.products);
                //     // kit.info = await productService.getProductKitById(kit.product_kit_id);
                //     for (let product of kit.products) {
                //         kit.products_info = await productService.getProductById(product.product);
                //     }
                // }
            }
            totalPrice = totalPrice.toFixed(2);

            let totalAmount = orders.reduce((total, order) => total + order.count, 0) + kits.reduce((total,order) => total + order.count, 0);

            if (!orders.length && !kits.length) {
                await bookingService.deleteCart(currentCart.id, transaction)
            }
            await transaction.commit();

            let cart = await currentUserCart(currentCart, orders, kits);

            let html = await templateUtil.getTemplate(
                {
                    // currency: currency,
                    result: cart
                }, 'client/shop/checkout-request');
            let cart_html = await templateUtil.getTemplate(
                {
                    // currency: currency,
                    cart: cart
                }, 'partials/cart-request');
            // res.status(200).json(result);
            return   res.send({
                cart_html: cart_html,
                data: cart,
                html: html
            })
        } catch (e) {
            if(transaction) transaction.rollback()
            console.log(e)
        }

    },

    getCurrentCart: async (req, res) => {
        let userId = req.user.id;
        if(!userId) {
            userId = req.user.userid;
        }
        let currency = req.currency;
        let currentCart = await bookingService.getCurrentCart({ user_id: userId, status: 1 })
        let result = null;
        if (currentCart) {
            let orders = await ordersService.getAllOrders({ cart_id: currentCart.id })
            let kits = await ordersService.getAllKitOrders({ cart_id: currentCart.id })
            let totalPrice = orders.reduce((total, order) => total + order.price, 0);
            if(kits && kits.length) {
                let totalKitPrice = kits.reduce((total, order) => total + order.price, 0);
                totalPrice += totalKitPrice;
            }
            totalPrice = totalPrice.toFixed(2);
            // if(currency.code == 0) {
            //     totalPrice = (totalPrice*currencyValue).toFixed(2);
            // }
            totalPrice = (totalPrice*currencyValue).toFixed(2);

            let totalAmount = orders.reduce((total, order) => total + order.count, 0) + kits.reduce((total,order) => total + order.count, 0);
            orders = JSON.parse(JSON.stringify(orders));
            let products = [];
            orders.forEach((order) => {
                order.price = (order.price*currencyValue).toFixed(2);
                order.product.price = (order.product.price*currencyValue).toFixed(2);
                order.product.product_variations[0].price = (order.product.product_variations[0].price*currencyValue).toFixed(2);
                // if(currency.code == 0) {
                //     order.price = (order.price*currencyValue).toFixed(2);
                //     order.product.price = (order.product.price*currencyValue).toFixed(2);
                //     order.product.product_variations[0].price = (order.product.product_variations[0].price*currencyValue).toFixed(2);
                // }
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
                // if(currency.code == 0) {
                //     kit.price = (kit.price*currencyValue).toFixed(2);
                //     kit.product_kit.price = (kit.product_kit.price*currencyValue).toFixed(2);
                // }
                let products = [];
                for (let product of JSON.parse(kit.products)) {
                    let kit_products = {
                        info: product,
                        variation: await variationService.getVariationById(product.variation),
                        product: await productService.getProductById(product.product, false)
                    }
                    // products.push({
                    //     info: product,
                    //     variation: await variationService.getVariationById(product.variation),
                    //     product: await productService.getProductById(product.product, false)
                    // })
                    kit_products.variation.price = (kit_products.variation.price*currencyValue).toFixed(2);
                    kit_products.product.price = (kit_products.product.price*currencyValue).toFixed(2);
                    // if(currency.code == 0) {
                    //     kit_products.variation.price = (kit_products.variation.price*currencyValue).toFixed(2);
                    //     kit_products.product.price = (kit_products.product.price*currencyValue).toFixed(2);
                    // }
                    products.push(kit_products)
                    kit.kit_products = products;
                }
                product_kits.push({
                    order: kit,
                    price: kit.price/kit.count,
                    kit: kit.product_kit,
                    // kit: await productService.getProductKitById(kit.product_kit_id),
                    products: products,
                    productsJson: JSON.stringify(products)
                })
            }
            result = {
                kits: product_kits,
                products: products,
                orders: {products: JSON.parse(JSON.stringify(orders)), kits: kits},
                totalPrice: totalPrice,
                totalAmount: totalAmount
            }
        } else result = 'кошик пустий'

        // res.status(200).json(result);

        return result;
    },

    getCurrentCheckout: async (req, res) => {
        let userId = req.user.userid;
        let currency = req.currency;
        let currentCart = await bookingService.getCurrentCart({ user_id: userId, status: 1 })
        let result = null;
        if (currentCart) {
            let orders = await ordersService.getAllOrders({ cart_id: currentCart.id })
            let kits = await ordersService.getAllKitOrders({ cart_id: currentCart.id })
            let totalPrice = orders.reduce((total, order) => total + order.price, 0);
            if(kits && kits.length) {
                let totalKitPrice = kits.reduce((total, order) => total + order.price, 0);
                totalPrice += totalKitPrice;

                // for (let kit of kits) {
                //     kit.products = JSON.parse(kit.products);
                //     // kit.info = await productService.getProductKitById(kit.product_kit_id);
                //     for (let product of kit.products) {
                //         kit.products_info = await productService.getProductById(product.product);
                //     }
                // }

            }
            totalPrice = totalPrice.toFixed(2);
            // if(currency.code == 0) {
            //     totalPrice = (totalPrice*currencyValue).toFixed(2);
            // }
            totalPrice = (totalPrice*currencyValue).toFixed(2);
            let totalAmount = orders.reduce((total, order) => total + order.count, 0) + kits.reduce((total,order) => total + order.count, 0);
            orders = JSON.parse(JSON.stringify(orders));
            let products = [];
            orders.forEach((order) => {
                order.price = (order.price*currencyValue).toFixed(2);
                order.product.price = (order.product.price*currencyValue).toFixed(2);
                order.product.product_variations[0].price = (order.product.product_variations[0].price*currencyValue).toFixed(2);
                // if(currency.code == 0) {
                //     order.price = (order.price*currencyValue).toFixed(2);
                //     order.product.price = (order.product.price*currencyValue).toFixed(2);
                //     order.product.product_variations[0].price = (order.product.product_variations[0].price*currencyValue).toFixed(2);
                // }
                products.push({
                    order: order,
                    product: order.product,
                    variation: order.product.product_variations[0]
                })
                return order
            })
            let product_kits = [];
            for (let kit of kits) {
                // if(currency.code == 0) {
                //     kit.price = (kit.price*currencyValue).toFixed(2);
                //     kit.product_kit.price = (kit.product_kit.price*currencyValue).toFixed(2);
                // }
                kit.price = (kit.price*currencyValue).toFixed(2);
                kit.product_kit.price = (kit.product_kit.price*currencyValue).toFixed(2);
                let products = [];
                for (let product of JSON.parse(kit.products)) {
                    let kit_products = {
                        info: product,
                        variation: await variationService.getVariationById(product.variation),
                        product: await productService.getProductById(product.product, false)
                    }
                    // products.push({
                    //     info: product,
                    //     variation: await variationService.getVariationById(product.variation),
                    //     product: await productService.getProductById(product.product, false)
                    // })
                    kit_products.variation.price = (kit_products.variation.price*currencyValue).toFixed(2);
                    kit_products.product.price = (kit_products.product.price*currencyValue).toFixed(2);
                    // if(currency.code == 0) {
                    //     kit_products.variation.price = (kit_products.variation.price*currencyValue).toFixed(2);
                    //     kit_products.product.price = (kit_products.product.price*currencyValue).toFixed(2);
                    // }
                    products.push(kit_products)
                    kit.kit_products = products;
                }
                product_kits.push({
                    order: kit,
                    price: kit.price/kit.count,
                    kit: kit.product_kit,
                    // kit: await productService.getProductKitById(kit.product_kit_id),
                    products: products,
                    productsJson: JSON.stringify(products)
                })
            }
            result = {
                kits: product_kits,
                productsJson: JSON.stringify(product_kits),
                products: products,
                orders: {products: JSON.parse(JSON.stringify(orders)), kits: kits},
                totalPrice: totalPrice,
                totalAmount: totalAmount
            }
        } else result = 'кошик пустий'

        const id = req.user ? req.user.userid : null;
        let dealerHeader;
        let user;
        if(id){
            // user = await dealerService.getClientDetail(id);
            // dealerHeader = await dealerService.getDealerUser(user.client.dealer_id);
        }

        const renderHeader = req.user ? 'client/layout-client-after-login.hbs' : 'client/layout-client.hbs';

     return   res.render('client/shop/checkout', {
            layout: renderHeader,
            dealerData: dealerHeader, //in header
            metaData: req.body.metaData,
            result: result,
            total_price: result.totalPrice,
            total_amount: result.totalAmount,
            first_name: user ? user.first_name : null,
            last_name: user ? user.last_name : null,
            cart: result ? result : null,
            currency: currency ? currency: null
        });


    },

    addProductToCartAjax: async (req, res) => {
        let currency = req.currency;
        let userId = req.user.userid;
        let { product_id, count, variation_id } = req.body;
        if(!product_id || !count || !variation_id) return res.json('Field missing')
        if(typeof count === 'string') count = parseInt(count)
        let currentCart = await bookingService.getCurrentCart({ user_id: userId, status: 1 })
        let cart_id;
        let product = await productService.getProductById(product_id, false)
        let variation = await variationService.getVariationById(variation_id)
        if(variation.product_id != product_id) return res.json('There is no product with this variation')
        // if (count > variation.quantity) {
        //     res.status(403).json({ message: `Ця варіація для ${product.name} закінчилася`});
        //     return;
        // }
        let price = variation.price * count

        const transaction = await sequelize.transaction();
        if (!currentCart) {
            if (count <= 0) return res.json('Enter the correct  quantity')
            // if (count <= 0) throw new Error('Введіть правильну кількість')
            let cart = await bookingService.createCart({
                date: Date.now(),
                total_price: price,
                user_id: userId,
                status: 1,
            }, transaction)
            cart_id = cart.id
            await ordersService.createOrder({
                product_id,
                cart_id,
                price,
                count,
                variation_id
            }, transaction);
            // await variationService.editVariation(variation_id, { quantity: variation.quantity - count }, transaction)

        } else {
            cart_id = currentCart.id
            let order = await ordersService.getAllOrders({
                cart_id: cart_id,
                product_id: product.id,
                variation_id: variation.id
            }, transaction)
            order = order[0]
            if (order) {
                if (count + order.count < 0) return res.json('Enter the correct  quantity')
                await ordersService.editOrder({
                    price: order.price + price,
                    count: order.count + count
                }, order.id, transaction);
                // await variationService.editVariation(variation_id, { quantity: variation.quantity - count }, transaction)
            } else {
                if (count <= 0) return res.json('Enter the correct  quantity')
                await ordersService.createOrder({
                    product_id,
                    cart_id,
                    price,
                    count,
                    variation_id
                }, transaction);
                // await variationService.editVariation(variation_id, { quantity: variation.quantity - count }, transaction)
            }
        }
        let orders = await ordersService.getAllOrders({ cart_id: cart_id }, transaction)
        let kits = await ordersService.getAllKitOrders({ cart_id: cart_id }, transaction)
        let totalPrice = orders.reduce((total, order) => total + order.price, 0);

        if(kits && kits.length) {
            let totalKitPrice = kits.reduce((total, order) => total + order.price, 0);
            totalPrice += totalKitPrice;

            // for (let kit of kits) {
            //     kit.products = JSON.parse(kit.products);
            //     // kit.info = await productService.getProductKitById(kit.product_kit_id);
            //     for (let product of kit.products) {
            //         kit.products_info = await productService.getProductById(product.product);
            //     }
            // }
        }
        totalPrice = totalPrice.toFixed(2);

        await bookingService.editCart({ date: Date.now(), total_price: totalPrice }, cart_id, transaction)
        await transaction.commit();

        let current_order = await ordersService.getAllOrders({
            cart_id: cart_id,
            product_id: product.id,
            variation_id: variation.id
        })
        current_order = current_order[0]
        if(current_order.count === 0) {
            await ordersService.deleteOrder(current_order.id);
            orders = await ordersService.getAllOrders({ cart_id: cart_id });
            if (!orders.length && !kits.length) {
                await bookingService.deleteCart(currentCart.id);
            }
        }
        let cart = await currentUserCart(currentCart, orders, kits);
        let html = await templateUtil.getTemplate(
            {
                // currency: currency,
                result: cart
            }, 'client/shop/checkout-request');
        let cart_html = await templateUtil.getTemplate(
            {
                // currency: currency,
                cart: cart
            }, 'partials/cart-request');
        // res.status(200).json(result);
        res.send({
            data: cart,
            html: html,
            cart_html: cart_html
        })
        // res.status(200).json(result);
        // return
    },

    addProductToCart: async (req, res) => {
        let userId = req.user.userid;
        let currency = req.currency;
        let { product_id, count, variation_id } = req.body;
        if(!product_id || !count || !variation_id) return res.json('Field missing')
        if(typeof count === 'string') count = parseInt(count)
        let currentCart = await bookingService.getCurrentCart({ user_id: userId, status: 1 })
        let cart_id;
        let product = await productService.getProductById(product_id, false)
        let variation = await variationService.getVariationById(variation_id)
        if(variation.product_id != product_id) return res.json('There is no product with this variation')
        // if (count > variation.quantity) {
        //     res.status(403).json({ message: `Ця варіація для ${product.name} закінчилася`});
        //     return;
        // }
        let price = variation.price * count

        const transaction = await sequelize.transaction();
        if (!currentCart) {
            if (count <= 0) return res.json('Enter the correct  quantity')
            // if (count <= 0) throw new Error('Введіть правильну кількість')
            let cart = await bookingService.createCart({
                date: Date.now(),
                total_price: price,
                user_id: userId,
                status: 1,
            }, transaction)
            cart_id = cart.id
            await ordersService.createOrder({
                product_id,
                cart_id,
                price,
                count,
                variation_id
            }, transaction);
            // await variationService.editVariation(variation_id, { quantity: variation.quantity - count }, transaction)

        } else {
            cart_id = currentCart.id
            let order = await ordersService.getAllOrders({
                cart_id: cart_id,
                product_id: product.id,
                variation_id: variation.id
            }, transaction)
            order = order[0]
            if (order) {
                if (count + order.count < 0) return res.json('Enter the correct  quantity')
                // if (count + order.count < 0) throw new Error('Введіть правильну кількість')
                await ordersService.editOrder({
                    price: order.price + price,
                    count: order.count + count
                }, order.id, transaction);
                // await variationService.editVariation(variation_id, { quantity: variation.quantity - count }, transaction)
            } else {
                if (count <= 0) return res.json('Enter the correct  quantity')
                // if (count <= 0) throw new Error('Введіть правильну кількість')
                await ordersService.createOrder({
                    product_id,
                    cart_id,
                    price,
                    count,
                    variation_id
                }, transaction);
                // await variationService.editVariation(variation_id, { quantity: variation.quantity - count }, transaction)
            }
        }
        let orders = await ordersService.getAllOrders({ cart_id: cart_id }, transaction)
        let kits = await ordersService.getAllKitOrders({ cart_id: cart_id }, transaction)
        let totalPrice = orders.reduce((total, order) => total + order.price, 0);
        if(kits && kits.length) {
            let totalKitPrice = kits.reduce((total, order) => total + order.price, 0);
            totalPrice += totalKitPrice;
            for (let kit of kits) {
                kit.products = JSON.parse(kit.products);
                // kit.info = await productService.getProductKitById(kit.product_kit_id);
                for (let product of kit.products) {
                    kit.products_info = await productService.getProductById(product.product);
                }
            }
        }
        totalPrice = totalPrice.toFixed(2);
        // if(currency.code == 0) {
        //     totalPrice = (totalPrice*currencyValue).toFixed(2);
        // }
        // for (let order of orders) {
        //     order.info = await productService.getProductById(order.product_id);
        // }
        let totalAmount = orders.reduce((total, order) => total + order.count, 0) + kits.reduce((total,order) => total + order.count, 0);

        await bookingService.editCart({ date: Math.floor(new Date().getTime() / 1000), total_price: totalPrice }, cart_id, transaction)
        await transaction.commit();
        totalPrice = (totalPrice*currencyValue).toFixed(2);

        let current_order = await ordersService.getAllOrders({
            cart_id: cart_id,
            product_id: product.id,
            variation_id: variation.id
        })
        current_order = current_order[0]
        if(current_order.count === 0) {
            await ordersService.deleteOrder(current_order.id);
            orders = await ordersService.getAllOrders({ cart_id: cart_id });
            if (!orders.length && !kits.length) {
                await bookingService.deleteCart(currentCart.id);
            }
        }

        orders = await ordersService.getAllOrders({ cart_id: cart_id })
        kits = await ordersService.getAllKitOrders({ cart_id: cart_id })

        let cart = await currentUserCart(true, orders, kits);

        let html = await templateUtil.getTemplate(
            {
                // currency: currency,
                result: cart
            }, 'client/shop/checkout-request');
        let cart_html = await templateUtil.getTemplate(
            {
                // currency: currency,
                cart: cart
            }, 'partials/cart-request');

        let result = {
            // orders: orders,
            product,
            orders: {products: orders, kits: kits},
            totalPrice: totalPrice,
            totalAmount: totalAmount,
            html: html,
            cart_html: cart_html
        }

       return res.status(200).json(result);

    },

    addProductKitToCartAjax: async (req, res) => {
        let currency = req.currency;
        let userId = req.user.userid;
        let { product_kit_id, count, products, comment } = req.body;
        let currentCart = await bookingService.getCurrentCart({ user_id: userId, status: 1 })
        if(typeof count === 'string') count = parseInt(count)
        let cart_id;
        let price = 0;
        for(let p of products) {
            let variation = await variationService.getVariationById(p.variation);
            // console.log(variation);
            // console.log(p);
            if(variation.product_id != p.product) return res.json('There is no product with this variation')
            // if (count > variation.quantity) {
            //     let product = await productService.getProductById(p.product, false);
            //     res.status(403).json({ message: `Ця варіація для ${product.name} закінчилася`});
            //     return;
            // }
            price += variation.price*p.quantity;
        }
        price = price * count;

        const transaction = await sequelize.transaction();
        if (!currentCart) {
            if (count <= 0) return res.json('Enter the correct  quantity')
            let cart = await bookingService.createCart({
                date: Date.now(),
                total_price: price,
                user_id: userId,
                status: 1,
            }, transaction)
            cart_id = cart.id
            await ordersService.createKitOrder({
                product_kit_id,
                cart_id,
                price,
                count,
                products: JSON.stringify(products),
                comment
            }, transaction);
            // for(let p of products) {
            //     let variation = await variationService.getVariationById(p.variation);
            //     await variationService.editVariation(variation.id, {quantity: variation.quantity - count*p.quantity}, transaction)
            // }
        } else {
            cart_id = currentCart.id
            let order = await ordersService.getAllKitOrders({
                cart_id: cart_id,
                product_kit_id: product_kit_id,
                products: JSON.stringify(products)
            }, transaction)
            order = order[0]
            if (order) {
                if (count + order.count < 0) return res.json('Enter the correct  quantity')
                await ordersService.editKitOrder({
                    price: order.price + price,
                    count: order.count + count,
                    comment
                }, order.id, transaction);
                // for(let p of products) {
                //     let variation = await variationService.getVariationById(p.variation);
                //     await variationService.editVariation(variation.id, {quantity: variation.quantity - count*p.quantity}, transaction)
                // }
            } else {
                if (count <= 0) return res.json('Enter the correct  quantity')
                // if (count <= 0) throw new Error('Введіть правильну кількість')
                await ordersService.createKitOrder({
                    product_kit_id,
                    cart_id,
                    price,
                    count,
                    products: JSON.stringify(products),
                    comment
                }, transaction);
                // for(let p of products) {
                //     let variation = await variationService.getVariationById(p.variation);
                //     await variationService.editVariation(variation.id, {quantity: variation.quantity - count*p.quantity}, transaction)
                // }
            }
        }
        let orders = await ordersService.getAllOrders({ cart_id: cart_id }, transaction)
        let kits = await ordersService.getAllKitOrders({ cart_id: cart_id }, transaction)
        let totalPrice = orders.reduce((total, order) => total + order.price, 0);


        if(kits && kits.length) {
            let totalKitPrice = kits.reduce((total, order) => total + order.price, 0);
            totalPrice += totalKitPrice;
        }
        totalPrice = totalPrice.toFixed(2);

        // let totalAmount = orders.reduce((total, order) => total + order.count, 0) + kits.reduce((total,order) => total + order.count, 0);

        await bookingService.editCart({ date: Date.now(), total_price: totalPrice }, cart_id, transaction)
        await transaction.commit();
        let current_order = await ordersService.getAllKitOrders({
            cart_id: cart_id,
            product_kit_id: product_kit_id,
            products: JSON.stringify(products)
        })
        current_order = current_order[0]
        if(current_order.count === 0) {
            await ordersService.deleteOrderKit(current_order.id);
            kits = await ordersService.getAllKitOrders({ cart_id: cart_id });
            if (!orders.length && !kits.length) {
                await bookingService.deleteCart(currentCart.id);
            }
        }

        let cart = await currentUserCart(currentCart, orders, kits);

        let html = await templateUtil.getTemplate(
            {
                // currency: currency,
                result: cart
            }, 'client/shop/checkout-request');
        let cart_html = await templateUtil.getTemplate(
            {
                // currency: currency,
                cart: cart
            }, 'partials/cart-request');
        // res.status(200).json(result);
        res.send({
            data: cart,
            html: html,
            cart_html: cart_html
        })
        // res.status(200).json(result);
        // return
    },

    addProductKitToCart: async (req, res) => {
        let userId = req.user.userid;
        let currency = req.currency;
        let { product_kit_id, count, products, comment } = req.body;
        let currentCart = await bookingService.getCurrentCart({ user_id: userId, status: 1 })
        if(typeof count === 'string') count = parseInt(count)
        let cart_id;
        let price = 0;
        // let product = await productService.getProductKitById(product_kit_id, false)
        for(let p of products) {
            let variation = await variationService.getVariationById(p.variation);
            if(variation.product_id != p.product) return res.json('There is no product with this variation')
            // if (count > variation.quantity) {
            //     let product = await productService.getProductById(p.product, false);
            //     res.status(403).json({ message: `Ця варіація для ${product.name} закінчилася`});
            //     return;
            // }
            price += variation.price*p.quantity;
        }
        price = price * count;

        const transaction = await sequelize.transaction();
        if (!currentCart) {
            if (count <= 0) return res.json('Enter the current quantity')
            // if (count <= 0) throw new Error('Введіть правильну кількість')
            let cart = await bookingService.createCart({
                date: Math.floor(new Date().getTime() / 1000),
                total_price: price,
                user_id: userId,
                status: 1,
            }, transaction)
            cart_id = cart.id
            await ordersService.createKitOrder({
                product_kit_id,
                cart_id,
                price,
                count,
                products: JSON.stringify(products),
                comment
            }, transaction);
            // for(let p of products) {
            //     let variation = await variationService.getVariationById(p.variation);
            //     await variationService.editVariation(variation.id, {quantity: variation.quantity - count*p.quantity}, transaction)
            // }
        } else {
            cart_id = currentCart.id
            let order = await ordersService.getAllKitOrders({
                cart_id: cart_id,
                product_kit_id: product_kit_id,
                products: JSON.stringify(products)
            }, transaction)
            order = order[0]
            if (order) {
                if (count + order.count < 0) return res.json('Enter the current quantity')
                // if (count + order.count < 0) throw new Error('Введіть правильну кількість')
                await ordersService.editKitOrder({
                    price: order.price + price,
                    count: order.count + count,
                    comment
                }, order.id, transaction);
                // for(let p of products) {
                //     let variation = await variationService.getVariationById(p.variation);
                //     await variationService.editVariation(variation.id, {quantity: variation.quantity - count*p.quantity}, transaction)
                // }
            } else {
                if (count <= 0) return res.json('Enter the current quantity')
                // if (count <= 0) throw new Error('Введіть правильну кількість')
                await ordersService.createKitOrder({
                    product_kit_id,
                    cart_id,
                    price,
                    count,
                    products: JSON.stringify(products),
                    comment
                }, transaction);
                // for(let p of products) {
                //     let variation = await variationService.getVariationById(p.variation);
                //     await variationService.editVariation(variation.id, {quantity: variation.quantity - count*p.quantity}, transaction)
                // }
            }
        }
        let orders = await ordersService.getAllOrders({ cart_id: cart_id }, transaction)
        let kits = await ordersService.getAllKitOrders({ cart_id: cart_id }, transaction)
        let totalPrice = orders.reduce((total, order) => total + order.price, 0);
        if(kits && kits.length) {
            let totalKitPrice = kits.reduce((total, order) => total + order.price, 0);
            totalPrice += totalKitPrice;
            // for (let kit of kits) {
            //     kit.products = JSON.parse(kit.products);
            //     // kit.info = await productService.getProductKitById(kit.product_kit_id);
            //     for (let product of kit.products) {
            //         kit.products_info = await productService.getProductById(product.product);
            //     }
            // }
        }
        // for (let order of orders) {
        //     order.info = await productService.getProductById(order.product_id);
        // }
        totalPrice = totalPrice.toFixed(2);
        // if(currency.code == 0) {
        //     totalPrice = (totalPrice*currencyValue).toFixed(2);
        // }

        let totalAmount = orders.reduce((total, order) => total + order.count, 0) + kits.reduce((total,order) => total + order.count, 0);

        await bookingService.editCart({ date: Math.floor(new Date().getTime() / 1000), total_price: totalPrice }, cart_id, transaction)
        await transaction.commit();
        totalPrice = (totalPrice*currencyValue).toFixed(2);
        let current_order = await ordersService.getAllKitOrders({
            cart_id: cart_id,
            product_kit_id: product_kit_id,
            products: JSON.stringify(products)
        })
        current_order = current_order[0]
        if(current_order.count === 0) {
            await ordersService.deleteOrderKit(current_order.id);
            kits = await ordersService.getAllKitOrders({ cart_id: cart_id });
            if (!orders.length && !kits.length) {
                await bookingService.deleteCart(currentCart.id);
            }
        }

        orders = await ordersService.getAllOrders({ cart_id: cart_id })
        kits = await ordersService.getAllKitOrders({ cart_id: cart_id })
        let cart = await currentUserCart(true, orders, kits);

        let html = await templateUtil.getTemplate(
            {
                // currency: currency,
                result: cart
            }, 'client/shop/checkout-request');

        let cart_html = await templateUtil.getTemplate(
            {
                // currency: currency,
                cart: cart
            }, 'partials/cart-request');
        let result = {
            // orders: orders,
            orders: {products: orders, kits: kits},
            totalPrice: totalPrice,
            totalAmount: totalAmount,
            html: html,
            cart_html: cart_html
        }

     return   res.status(200).json(result);

    }
}
