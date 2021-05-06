const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");


const addressAttributes = [
    'street',
    'apartment',
    'entrance',
    'floor',
    'intercom',
    'district',
    'city',
    'country',
    'first_name',
    'last_name',
    'email',
    'phone'
];
const productAttributes = [
    'variation',
    'type',
    'status',
    'short_description',
    'description',
    'name',
    'price',
    'old_price',
    'availability',
    'brand_id',
    'model_id',
    'sku',
    'promotional',
    'novelty',
    'popular',
    'image',
    'slag'
];
const userAttributes = [
    'last_name',
    'first_name',
    'email',
    'phone',
];
const bookingAttributes = [
    'id',
    'date',
    'total_price',
    'user_id',
    'address_id',
    'status'
];
const variationAttributes = [
    'id',
    'product_id',
    'price',
    'old_price',
    'status',
    'sku',
    'gallery'
];


module.exports = {
    createOrder: async (order, trans) => {
        let transaction = null;
        transaction = trans ? trans : await sequelize.transaction();

        try {
            let result = await models.orders.create(order, { transaction });

            result = await models.orders.findOne({
                where: { id: result.id },
                transaction,
                include: [
                    {
                        model: models.booking, as: "booking", attributes: bookingAttributes,
                        include: [
                            { model: models.address, as: "address", attributes: addressAttributes },
                            { model: models.user, as: "user", attributes: userAttributes }
                        ]
                    },
                    {
                        model: models.product, as: "product", attributes: productAttributes,
                        include: [
                            //TODO: Make for attributes
                            { model: models.model, as: "model", attributes: ['title'] },
                            { model: models.brand, as: "brand", attributes: ['title'] },
                            {
                                model: models.product_category,
                                as: 'category',
                                attributes: ['id', 'title','slag'],
                                through: { attributes: [] }
                            },
                            {
                                model: models.product_variations,
                                as: "product_variations",
                                attributes: variationAttributes,
                                include: [
                                    {
                                        model: models.attribute,
                                        as: 'attribute',
                                        attributes: ['id', 'title', 'value', 'status', 'type'],
                                        through: { attributes: ['value'], as: 'activeValue' }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },

    getAllOrders: async (settings, trans) => {
        let transaction = null;
        trans ? transaction = trans : {};
        try {

            let where = {
                variation_id : {[Op.eq] : sequelize.col('product.product_variations.id')}
            }
            if (settings.booking_id) {
                where.booking_id = settings.booking_id
            }
            if (settings.product_id) {
                where.product_id = settings.product_id
            }
            if(settings.variation_id) {
                where.variation_id = settings.variation_id
            }
            if(settings.cart_id) {
                where.cart_id = settings.cart_id
            }
            if(settings.products) {
                where.products = settings.products
            }
            let result = await models.orders.findAll({
                where: where,
                // on: { '$orders.variation_id$' : sequelize.col('product.product_variations.id')},
                subQuery: false,
                include: [
                    {
                        model: models.booking, as: "booking", attributes: bookingAttributes,
                        include: [
                            {model: models.address, as: "address", attributes: addressAttributes},
                            {model: models.user, as: "user", attributes: userAttributes}
                        ]
                    },
                    {
                        model: models.product, as: "product", attributes: productAttributes,
                        include: [
                            //TODO: Make for attributes

                            {model: models.model, as: "model", attributes: ['title']},
                            {model: models.brand, as: "brand", attributes: ['title']},
                            {
                                model: models.product_category,
                                as: 'category',
                                attributes: ['id', 'title','slag'],
                                through: {attributes: []}
                            },
                            {
                                model: models.product_variations,
                                as: "product_variations",
                                attributes: variationAttributes,
                                include: [
                                    {
                                        model: models.attribute,
                                        as: 'attribute',
                                        attributes: ['id', 'title', 'value', 'status', 'type'],
                                        through: {attributes: ['value'], as: 'activeValue'}
                                    }
                                ]
                            }
                        ]
                    }
                ],
                transaction
            })
            return result;
        } catch (err) {
            err.code = 400;
            if (trans) await trans.rollback();
            throw err;
        }
    },
    getOrderById: async (id) => {
        try {
            let result = await models.orders.findOne({
                where: {id: id},
                include: [
                    {
                        model: models.booking, as: "booking", attributes: bookingAttributes,
                        include: [
                            {model: models.address, as: "address", attributes: addressAttributes},
                            {model: models.user, as: "user", attributes: userAttributes}
                        ]
                    },
                    {
                        model: models.product, as: "product", attributes: productAttributes,
                        include: [
                            //TODO: Make for attributes
                            {model: models.model, as: "model", attributes: ['title']},
                            {model: models.brand, as: "brand", attributes: ['title']},
                            {
                                model: models.product_category,
                                as: 'category',
                                attributes: ['id', 'title','slag'],
                                through: {attributes: []}
                            },
                            {
                                model: models.product_variations,
                                as: "product_variations",
                                attributes: variationAttributes,
                                include: [
                                    {
                                        model: models.attribute,
                                        as: 'attribute',
                                        attributes: ['id', 'title', 'value', 'status', 'type'],
                                        through: {attributes: ['value'], as: 'activeValue'}
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    deleteOrder: async(id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.orders.destroy({
                where: {id: id}
          , transaction  })
            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },
    editOrder: async (order, id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            await models.orders.update(order, {where: {id}, transaction});
            if (!trans) await transaction.commit();
            let result = await models.orders.findOne({
                where: {id: id},
                include: [
                    {
                        model: models.booking, as: "booking", attributes: bookingAttributes,
                        include: [
                            {model: models.address, as: "address", attributes: addressAttributes},
                            {model: models.user, as: "user", attributes: userAttributes}
                        ]
                    },
                    {
                        model: models.product, as: "product", attributes: productAttributes,
                        include: [
                            //TODO: Make for attributes
                            {model: models.model, as: "model", attributes: ['title']},
                            {model: models.brand, as: "brand", attributes: ['title']},
                            {
                                model: models.product_category,
                                as: 'category',
                                attributes: ['id', 'title','slag'],
                                through: {attributes: []}
                            },
                            {
                                model: models.product_variations,
                                as: "product_variations",
                                attributes: variationAttributes,
                                include: [
                                    {
                                        model: models.attribute,
                                        as: 'attribute',
                                        attributes: ['id', 'title', 'value', 'status', 'type'],
                                        through: {attributes: ['value'], as: 'activeValue'}
                                    }
                                ]
                            },
                        ]
                    }
                ]
            })

            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },
    createKitOrder: async (order, trans) => {
        let transaction = null;
        transaction = trans ? trans : await sequelize.transaction();

        try {
            let result = await models.order_kits.create(order, { transaction });

            result = await models.order_kits.findOne({
                where: { id: result.id },
                transaction,
                include: [
                    {
                        model: models.cart, as: "cart",
                        include: [
                            { model: models.user, as: "user", attributes: userAttributes }
                        ]
                    },
                    {
                        model: models.booking, as: "booking", attributes: bookingAttributes,
                        include: [
                            { model: models.address, as: "address", attributes: addressAttributes },
                            { model: models.user, as: "user", attributes: userAttributes }
                        ]
                    },
                    {
                        model: models.product_kit, as: "product_kit",
                        include: [

                            {
                                model: models.product_kit_category,
                                as: 'as_category_kit_product',
                                attributes: ['id', 'title', 'slag'],
                                through: {attributes: []}
                            },
                            {
                                model: models.product,
                                as: 'as_product_kit',
                                attributes: ['id','sku', 'name','slag'],
                                through: {  attributes: ['substitute','position', 'quantity' ] },
                                include: [
                                    {
                                        model: models.product_variations,
                                        as: "product_variations",
                                        //order: variationOrder,
                                        attributes: variationAttributes,
                                        include: [
                                            {
                                                model: models.attribute,
                                                as: 'attribute',
                                                attributes: ['id', 'title', 'value', 'status', 'type'],
                                                through: {attributes: ['value'], as: 'activeValue'}
                                            }
                                        ]
                                    },



                                ],

                            },
                            {
                                model: models.attribute_kit,
                                as: 'as_product_kit_to_attribute',
                                //required: true,
                                attributes: ['id', 'title', 'value', 'status', 'type']
                                //through: {attributes: ['value'], as: 'activeValue', where: {attribute_id: [7], value: ["4"]}}
                                //through: {attributes: ['value'], as: 'activeValue', where: attributes}

                            }

                        ],
                    }
                ]
            })
            if (!trans) await transaction.commit();
            // JSON.parse(JSON.stringify(result));
            return result.toJSON();
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },
    getOrderKitById: async (id) => {
        try {
            let result = await models.order_kits.findOne({
                where: { id: id },
                include: [
                    {
                        model: models.cart, as: "cart",
                        include: [
                            { model: models.user, as: "user", attributes: userAttributes }
                        ]
                    },
                    {
                        model: models.booking, as: "booking", attributes: bookingAttributes,
                        include: [
                            { model: models.address, as: "address", attributes: addressAttributes },
                            { model: models.user, as: "user", attributes: userAttributes }
                        ]
                    },
                    {
                        model: models.product_kit, as: "product_kit",
                        include: [

                            {
                                model: models.product_kit_category,
                                as: 'as_category_kit_product',
                                attributes: ['id', 'title','slag'],
                                through: {attributes: []}
                            },
                            {
                                model: models.product,
                                as: 'as_product_kit',
                                attributes: ['id','sku', 'name','slag'],
                                through: {  attributes: ['substitute','position', 'quantity' ] },
                                include: [
                                    {
                                        model: models.product_variations,
                                        as: "product_variations",
                                        //order: variationOrder,
                                        attributes: variationAttributes,
                                        include: [
                                            {
                                                model: models.attribute,
                                                as: 'attribute',
                                                attributes: ['id', 'title', 'value', 'status', 'type'],
                                                through: {attributes: ['value'], as: 'activeValue'}
                                            }
                                        ]
                                    },
                                ],
                            },
                            {
                                model: models.attribute_kit,
                                as: 'as_product_kit_to_attribute',
                                //required: true,
                                attributes: ['id', 'title', 'value', 'status', 'type']
                                //through: {attributes: ['value'], as: 'activeValue', where: {attribute_id: [7], value: ["4"]}}
                                //through: {attributes: ['value'], as: 'activeValue', where: attributes}

                            }

                        ],
                    }
                ]
            })
            // JSON.parse(JSON.stringify(result));
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    deleteOrderKit: async(id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            let result = await models.order_kits.destroy({
                where: {id: id},
           transaction } )
            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },

    getAllKitOrders: async (settings, trans) => {
        let transaction = null;
        trans ? transaction = trans : {};
        try {

            let where = {};
            if (settings.booking_id) {
                where.booking_id = settings.booking_id
            }
            if (settings.product_kit_id) {
                where.product_kit_id = settings.product_kit_id
            }
            if(settings.cart_id) {
                where.cart_id = settings.cart_id
            }
            if(settings.products) {
                where.products = settings.products
            }
            let result = await models.order_kits.findAll({
                where: where,
                // on: { '$orders.variation_id$' : sequelize.col('product.product_variations.id')},
                subQuery: false,
                include: [
                    {
                        model: models.cart, as: "cart",
                        include: [
                            { model: models.user, as: "user", attributes: userAttributes }
                        ]
                    },
                    {
                        model: models.booking, as: "booking", attributes: bookingAttributes,
                        include: [
                            { model: models.address, as: "address", attributes: addressAttributes },
                            { model: models.user, as: "user", attributes: userAttributes }
                        ]
                    },
                    {
                        model: models.product_kit, as: "product_kit",
                        include: [

                            {
                                model: models.product_kit_category,
                                as: 'as_category_kit_product',
                                attributes: ['id', 'title','slag'],
                                through: {attributes: []}
                            },
                            {
                                model: models.product,
                                as: 'as_product_kit',
                                attributes: ['id','sku', 'name','slag'],
                                through: {  attributes: ['substitute','position', 'quantity' ] },
                                include: [
                                    {
                                        model: models.product_variations,
                                        as: "product_variations",
                                        //order: variationOrder,
                                        attributes: variationAttributes,
                                        include: [
                                            {
                                                model: models.attribute,
                                                as: 'attribute',
                                                attributes: ['id', 'title', 'value', 'status', 'type'],
                                                through: {attributes: ['value'], as: 'activeValue'}
                                            }
                                        ]
                                    },
                                ],
                            },
                            {
                                model: models.attribute_kit,
                                as: 'as_product_kit_to_attribute',
                                //required: true,
                                attributes: ['id', 'title', 'value', 'status', 'type']
                                //through: {attributes: ['value'], as: 'activeValue', where: {attribute_id: [7], value: ["4"]}}
                                //through: {attributes: ['value'], as: 'activeValue', where: attributes}

                            }

                        ],
                    }
                ],
                transaction
            })
            // JSON.parse(JSON.stringify(result));
            return  result.map(function(item) {
                return item.toJSON();
            })
        } catch (err) {
            err.code = 400;
            if (trans) await trans.rollback();
            throw err;
        }
    },

    getKitOrder: async (settings, trans) => {
        let transaction = null;
        trans ? transaction = trans : {};
        try {

            let where = {};
            if (settings.booking_id) {
                where.booking_id = settings.booking_id
            }
            if (settings.product_kit_id) {
                where.product_kit_id = settings.product_kit_id
            }
            if(settings.cart_id) {
                where.cart_id = settings.cart_id
            }
            if(settings.products) {
                where.products = settings.products
            }
            let result = await models.order_kits.findOne({
                where: where,
                include: [
                    {
                        model: models.cart, as: "cart",
                        include: [
                            { model: models.user, as: "user", attributes: userAttributes }
                        ]
                    },
                    {
                        model: models.booking, as: "booking", attributes: bookingAttributes,
                        include: [
                            { model: models.address, as: "address", attributes: addressAttributes },
                            { model: models.user, as: "user", attributes: userAttributes }
                        ]
                    },
                    {
                        model: models.product_kit, as: "product_kit",
                        include: [

                            {
                                model: models.product_kit_category,
                                as: 'as_category_kit_product',
                                attributes: ['id', 'title','slag'],
                                through: {attributes: []}
                            },
                            {
                                model: models.product,
                                as: 'as_product_kit',
                                attributes: ['id','sku', 'name','slag'],
                                through: {  attributes: ['substitute','position', 'quantity' ] },
                                include: [
                                    {
                                        model: models.product_variations,
                                        as: "product_variations",
                                        //order: variationOrder,
                                        attributes: variationAttributes,
                                        include: [
                                            {
                                                model: models.attribute,
                                                as: 'attribute',
                                                attributes: ['id', 'title', 'value', 'status', 'type'],
                                                through: {attributes: ['value'], as: 'activeValue'}
                                            }
                                        ]
                                    },
                                ],
                            },
                            {
                                model: models.attribute_kit,
                                as: 'as_product_kit_to_attribute',
                                //required: true,
                                attributes: ['id', 'title', 'value', 'status', 'type']

                            }

                        ],
                    }
                ],
                transaction
            })
            // JSON.parse(JSON.stringify(result));
            return result.toJSON();
        } catch (err) {
            err.code = 400;
            if (trans) await trans.rollback();
            throw err;
        }
    },
    editKitOrder: async (order, id, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();
            await models.order_kits.update(order, {where: {id}, transaction});
            if (!trans) await transaction.commit();
            let result = await models.order_kits.findOne({
                where: {id: id},
                include: [
                    {
                        model: models.cart, as: "cart",
                        include: [
                            { model: models.user, as: "user", attributes: userAttributes }
                        ]
                    },
                    {
                        model: models.booking, as: "booking", attributes: bookingAttributes,
                        include: [
                            { model: models.address, as: "address", attributes: addressAttributes },
                            { model: models.user, as: "user", attributes: userAttributes }
                        ]
                    },
                    {
                        model: models.product_kit, as: "product_kit",
                        include: [
                            {
                                model: models.product_kit_category,
                                as: 'as_category_kit_product',
                                attributes: ['id', 'title','slag'],
                                through: {attributes: []}
                            },
                            {
                                model: models.product,
                                as: 'as_product_kit',
                                attributes: ['id','sku', 'name','slag'],
                                through: {  attributes: ['substitute','position', 'quantity' ] },
                                include: [
                                    {
                                        model: models.product_variations,
                                        as: "product_variations",
                                        //order: variationOrder,
                                        attributes: variationAttributes,
                                        include: [
                                            {
                                                model: models.attribute,
                                                as: 'attribute',
                                                attributes: ['id', 'title', 'value', 'status', 'type'],
                                                through: {attributes: ['value'], as: 'activeValue'}
                                            }
                                        ]
                                    },
                                ],
                            },
                            {
                                model: models.attribute_kit,
                                as: 'as_product_kit_to_attribute',
                                //required: true,
                                attributes: ['id', 'title', 'value', 'status', 'type']

                            }

                        ],
                    }
                ],
            })
            // JSON.parse(JSON.stringify(result));
            return  result.toJSON();
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },

}
