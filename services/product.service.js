const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const  {Op}   = require("sequelize");

const _ = require('lodash');
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
    'image'
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
const toPlain = response => {
    const flattenDataValues = ({ dataValues }) =>
        _.mapValues(dataValues, value => (
            _.isArray(value) && _.isObject(value[0]) && _.isObject(value[0].dataValues)
                ? _.map(value, flattenDataValues)
                : _.isObject(value) && _.isObject(value.dataValues)
                ? flattenDataValues(value)
                : value
        ));

    return _.isArray(response) ? _.map(response, flattenDataValues) : flattenDataValues(response);
};
module.exports = {
     createProduct: async (product, categories, product_variations, trans) => {
        let transaction = null;
        try {

            transaction = trans ? trans : await sequelize.transaction();
            let createdProduct = await models.product.create(product, transaction);

            for (let id of categories) {
                await models.product_to_category.create({
                    product_id: createdProduct.id,
                    product_category_id: id
                }, {transaction})
            }
            for (let variation of product_variations) {
                let prodVar = await models.product_variations.create(
                    {
                        product_id: createdProduct.id,
                        sku: variation.sku,
                        gallery: variation.gallery ? variation.gallery.toString() : null,
                        price: variation.price,
                        old_price: variation.old_price,
                    }, {transaction}
                );
                for (let atr of variation.attrubutes) {
                    await models.product_to_attribute.create(
                        {
                            attribute_id: atr.id,
                            value: atr.value,
                            product_variation_id: prodVar.id
                        }, {transaction}
                    )
                }
            }
            let result = await models.product.findOne({
                where: {id: createdProduct.id},
                include: [
                    {model: models.brand, as: 'brand', attributes: ['title']},
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
                    {model: models.model, as: "model", attributes: ['title']}
                ],
                through: {attributes: []}
            })

            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },
    getCagegoryById: async ( id) => {


        let result = await models.product_category.findOne({
            where: {id: id}
        })

      //  result =    JSON.parse(JSON.stringify(result));
        return result.toJSON();
    },
    getCategoryBySlag: async (slag) => {


        let result = await models.product_category.findOne({
            where: {slag: slag}
        })
        // result =    JSON.parse(JSON.stringify(result));
        return result.toJSON();
    },

    async getCategories(admin) {
        try {


            let include = {}
            if (!admin) {
                include = [
                    {
                        model: models.product, as: 'product', attributes: [],
                        where: {status: 2},
                        through: {attributes: []}
                    }
                ]
            } else {
                include = [
                    {
                        model: models.product, as: 'product', attributes: [],
                        through: {attributes: []}
                    }
                ]
            }
            let result =  await models.product_category.findAll({
                include: include
            });


            return result.map(kit => kit.toJSON());
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    getCagegoryKitById: async ( id) => {


        let result = await models.product_kit_category.findOne({
            where: {id: id}
        })
        // result =    JSON.parse(JSON.stringify(result));
        return result.toJSON();
    },
    getCategoryKitBySlag: async (slag) => {


        let result = await models.product_kit_category.findOne({
            where: {slag: slag}
        })

        return result.toJSON();
    },
    async getCategoriesKit(admin) {
        try {

          //  let result = await models.product_kit_category.findAll({raw: true})
            let include = {}
            if (!admin) {
                include = [
                    {
                        model: models.product_kit, as: 'as_product_kit_category', attributes: [],
                        where: {status: 2},
                        through: {attributes: []}
                    }
                ]
            } else {
                include = [
                    {
                        model: models.product_kit, as: 'as_product_kit_category', attributes: [],
                        through: {attributes: []}
                    }
                ]
            }
            let result =  await models.product_kit_category.findAll({
                include: include
            });

            return result.map(kit => kit.toJSON());
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    getAllProductsKitShop: async (category, sort, filter, brand, attributes, productIds,perPage,page,offset,limit) => {
        try {
            let order = []
            let variationOrder = []
            let where = {}
            let whereVariation = {
                //status: 1
            }
            let whereCategory = {}
            let whereBrand = {}
            let whereAttributes = {}
            let attrIds = []
            let attrValue = []
            if(attributes){
                attributes.forEach(a => {

                    attrValue.push(a.value)
                })

                whereAttributes.value = attrValue
            }
            if (sort && sort.price) {
                order.push(['price', sort.price])
            }
            if (sort && sort.popular) {
                order.push(['popular', sort.popular])
            }
            //TODO:Check this sorting (add new fields)

            if (sort && sort.novelty) {
                order.push(['novelty', sort.novelty])
            }
            if (sort && sort.promotional) {
                order.push(['promotional', sort.promotional])
            }
            if (sort && sort.name) {
                order.push(['name', sort.name])
            }
            // if(!sort){
            //     order.push(['createdAt', 'DESC'])
            // }
            if (filter && filter.price) {
                where.price = {[Op.between]: [filter.price.from, filter.price.to]}
            }
            if (filter && filter.status) {
                where.status = filter.status
            } else {
                where.status = 2
            }
            if (productIds) {
                where.id = productIds
            }
            if (category) {
                whereCategory = {slag: category}
            }
            if (brand) {
                whereBrand = {id: brand}
            }

            let result = await models.product_kit.findAndCountAll({
                order: order,
                where: where,
                offset: offset,
                distinct: true,
                limit:10,
                include: [
                    {
                        model: models.product_kit_category,
                        as: 'as_category_kit_product',
                        attributes: ['id', 'title','slag' ],
                        required: true,
                        through: {attributes: []},
                        where: whereCategory
                    },
                    {
                        model: models.attribute_kit,
                        as: 'as_product_kit_to_attribute',
                        attributes: ['id', 'title', 'value', 'status', 'type'],
                        required: true,
                        through: {attributes: ['value'], as: 'activeValue', where: whereAttributes}
                      //  through: {attributes: ['value'], as: 'activeValue', where: {value: ["SW-M (білий шовк матовий)"]}}
                        //through: {attributes: ['value'], as: 'activeValue', where: attributes}

                    }
                ]

            })
            let prices = await models.product_kit.findAll({
                attributes: [[sequelize.fn('max', sequelize.col('product_kit.price')), 'maxPrice'],
                             [sequelize.fn('min', sequelize.col('product_kit.price')), 'minPrice']],
                include: [
                    {
                        model: models.product_kit_category,
                        as: 'as_category_kit_product',
                        attributes: [],
                        required: true,
                        where: {slag: category}
                    },
                ]
            })
            if(prices[0]){
                prices = {...prices[0].dataValues}
            }

           //  prices =    JSON.parse(JSON.stringify(prices));



            // result =     JSON.parse(JSON.stringify(result));
// result=  result.map(function(item) {
//     return item.toJSON();
// })

            return {
                products: result,
                minPrice: prices.minPrice,
                maxPrice: prices.maxPrice,
            };
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    getProductKitBySlag: async (slag, getByUser) => {

        if(getByUser){
            await models.product.increment('popular', {by: 1, where: {slag: slag}});
        }
        let result = await models.product_kit.findOne({
            where: {slag: slag},
            // order: [[ {models : models.product_to_kit } , 'position' , 'ASC']],

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

        })



        // result =    JSON.parse(JSON.stringify(result));
       result = toPlain(result);
        if(result.kit)
        {
            let result_kit = await models.product_kit.findAll({
                where: {
                    status: 2 ,
                    kit:result.kit
                },
                include: [
                    {
                        model: models.attribute_kit,
                        as: 'as_product_kit_to_attribute',
                        required: true,
                        where: {id:[7,12]},
                        attributes: ['id', 'title', 'value', 'status', 'type']
                    }
                ]
            })

            result.result_kit_select = result_kit;
           // result.result_kit_select = result.result_kit.map(kit => kit.toJSON());

           
            result.result_kit_select = JSON.parse(JSON.stringify(result_kit));
            //  result.result_kit_select = result.result_kit.map(kit => kit.toJSON());


        }


       
    

        //   result.characteristic = JSON.parse(result.characteristic)
        // result.gallery = result.gallery.split(",");

        return result
    },

    getProductKitById: async (id, getByUser) => {

            if(getByUser){
                await models.product.increment('popular', {by: 1, where: {id: id}});
            }
            let result = await models.product_kit.findOne({
                where: {id: id},
                // order: [[ {models : models.product_to_kit } , 'position' , 'ASC']],

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

            })



        // result =    JSON.parse(JSON.stringify(result));
       result=  result.map(function(item) {
            return item.toJSON();
        })
            if(result.kit)
            {
                let result_kit = await models.product_kit.findAll({
                    where: {
                       status: 2 ,
                        kit:result.kit
                    },
                    include: [
                        {
                            model: models.attribute_kit,
                            as: 'as_product_kit_to_attribute',
                            required: true,
                            where: {id:[7,12]},
                            attributes: ['id', 'title', 'value', 'status', 'type']
                        }
                    ]
                })
                result.result_kit_select = result_kit;

            }


       // result =    JSON.parse(JSON.stringify(result));
         //   result.characteristic = JSON.parse(result.characteristic)
           // result.gallery = result.gallery.split(",");
           return  result.map(function(item) {
            return item.toJSON();
        })

    },

    getAllProducts: async (category, sort, filter, brand, attributes, productIds,perPage,page,offset,limit) => {
        try {
            let order = []
            let variationOrder = []
            let where = {}
            let whereVariation = {
                //status: 1
            }
            let whereCategory = {}
            let whereBrand = {}
            let whereAttributes = {}
            let attrIds = []
            let attrValue = []
            if(attributes){
                attributes.forEach(a => {
                    attrIds.push(a.attribute_id)
                    attrValue.push(a.value)
                })
                whereAttributes.attribute_id = attrIds
                whereAttributes.value = attrValue
            }
            if (sort && sort.price) {
                order.push(['price', sort.price])
            }
            if (sort && sort.popular) {
                order.push(['popular', sort.popular])
            }
            //TODO:Check this sorting (add new fields)

            if (sort && sort.novelty) {
                order.push(['novelty', sort.novelty])
            }
            if (sort && sort.promotional) {
                order.push(['promotional', sort.promotional])
            }
            if (sort && sort.name) {
                order.push(['name', sort.name])
            }
            if(!sort){
                order.push(['createdAt', 'DESC'])
            }
            if (filter && filter.price) {
                whereVariation.price = {[Op.between]: [filter.price.from, filter.price.to]}
            }
            if (filter && filter.status) {
                where.status = filter.status
            } else {
                where.status = 2
            }
            if (productIds) {
                where.id = productIds
            }
            if (category) {
                whereCategory = {id: category}
            }
            if (brand) {
                whereBrand = {id: brand}
            }

            let result = await models.product.findAndCountAll({
                 include: [
                    {
                        model: models.product_variations,
                        as: "product_variations",
                        required: true,
                        //order: variationOrder,
                        attributes: variationAttributes,
                        where: whereVariation,


                        include: [
                            {
                                model: models.attribute,
                                as: 'attribute',
                                required: true,
                                attributes: ['id', 'title', 'value', 'status', 'type'],
                                through: {attributes: ['value'], as: 'activeValue', where: whereAttributes}
                                //through: {attributes: ['value'], as: 'activeValue', where: {attribute_id: [7], value: ["4"]}}
                                //through: {attributes: ['value'], as: 'activeValue', where: attributes}

                            }
                        ]
                    },
                    {model: models.brand, as: 'brand', attributes: ['title'], where: whereBrand},
                    {
                        model: models.product_category,
                        as: 'category',
                        attributes: ['id', 'title', 'slag'],
                        required: true,
                        through: {attributes: []},
                        where: whereCategory
                    },
                    {model: models.model, as: "model", attributes: ['title']}


                ]
            })



            //console.log('In mysql ', result);
            let prices = await models.product.findAll({
                // attributes: [[sequelize.fn('max', sequelize.col('price')), 'maxPrice']],
                // where: {status: 2},
                attributes: [],
                include: [
                    {
                        model: models.product_variations,
                        //where: {status: 1},
                        attributes: [
                            [sequelize.fn('max', sequelize.col('product_variations.price')), 'maxPrice'],
                            [sequelize.fn('min', sequelize.col('product_variations.price')), 'minPrice']
                        ]
                    },
                    {
                        model: models.product_category,
                        as: 'category',
                        attributes: [],
                        where: whereCategory
                    },
                ]
            })

            if(prices[0].product_variations[0]){
                prices = {...prices[0].product_variations[0].dataValues}
            }

            // result =    JSON.parse(JSON.stringify(result));
result=  result.map(function(item) {
    return item.toJSON();
})
            return {
                products: result,
                minPrice: prices.minPrice,
                maxPrice: prices.maxPrice,
            };
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    getAllProductsShop: async (category, sort, filter, brand, attributes, productIds,perPage,page,offset,limit) => {
        try {

            let order = []
            let variationOrder = []
            let where = {}
            let whereVariation = {
                //status: 1
            }
            let whereCategory = {}
            let whereBrand = {}
            let whereAttributes = {}
            let attrIds = []
            let attrValue = []
            if(attributes){
                attributes.forEach(a => {
                    attrValue.push(a.value)
                })
              //  whereAttributes.attribute_id = attrIds
                whereAttributes.value = attrValue
            }

            if (sort && sort.price) {
                order.push(['price', sort.price])
            }
            if (sort && sort.popular) {
                order.push(['popular', sort.popular])
            }
            //TODO:Check this sorting (add new fields)

            if (sort && sort.novelty) {
                order.push(['novelty', sort.novelty])
            }
            if (sort && sort.promotional) {
                order.push(['promotional', sort.promotional])
            }
            if (sort && sort.name) {
                order.push(['name', sort.name])
            }
            // if(!sort){
            //     order.push(['createdAt', 'DESC'])
            // }
            if (filter && filter.price) {
                whereVariation.price = {[Op.between]: [filter.price.from, filter.price.to]}
            }
            if (filter && filter.status) {
                where.status = filter.status
            } else {
                where.status = 2
            }
            if (productIds) {
                where.id = productIds
            }
            if (category) {
                whereCategory = {slag: category}
            }
            if (brand) {
                whereBrand = {id: brand}
            }
            let result = await models.product.findAndCountAll({
                order: order,
                where: where,
                limit: 10,
                offset: offset,
                distinct: true,
                include: [
                    {
                        model: models.product_variations,
                        as: "product_variations",
                        required: true,
                        //order: variationOrder,
                        attributes: variationAttributes,

                        where: whereVariation,

                        include: [
                            {
                                model: models.attribute,
                                as: 'attribute',
                               // required: true,
                                attributes: ['id', 'title', 'value', 'status', 'type'],
                                through: {attributes: ['value'], as: 'activeValue', where: whereAttributes}

                            }

                        ]

                    },
                    {
                        model: models.product_category,
                        as: 'category',
                        attributes: ['id', 'title'],
                        required: true,
                        through: {attributes: []},
                        where: whereCategory
                    }
                    ]
            })

            let prices = await models.product.findAll({
                // attributes: [[sequelize.fn('max', sequelize.col('price')), 'maxPrice']],
                // where: {status: 2},
                attributes: [],
                include: [
                    {
                        model: models.product_variations,
                        //where: {status: 1},
                        attributes: [
                            [sequelize.fn('max', sequelize.col('product_variations.price')), 'maxPrice'],
                            [sequelize.fn('min', sequelize.col('product_variations.price')), 'minPrice']
                        ]
                    },
                    {
                        model: models.product_category,
                        as: 'category',
                        attributes: [],
                        where: whereCategory
                    },
                ]
            })

            if(prices[0].product_variations[0]){
                prices = {...prices[0].product_variations[0].dataValues}
            }

            // let rows = result.rows.map((item) => item.toJSON())
            // result = { count: result.count, rows }

            return {
                products: result,
                minPrice: prices.minPrice,
                maxPrice: prices.maxPrice,
            };
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    getProductsForMain: async (sort) => {
        try {
            let result = await models.product.findAll({
                order: [[sort, 'DESC']],
                limit: 10,
                include: [
                    {
                        model: models.product_variations,
                        as: "product_variations",
                        required: true,
                        //order: variationOrder,
                        attributes: variationAttributes,
                        include: [
                            {
                                model: models.attribute,
                                as: 'attribute',
                                required: true,
                                attributes: ['id', 'title', 'value', 'status', 'type'],
                                through: {attributes: ['value'], as: 'activeValue'}
                            }
                        ]
                    },
                    {model: models.brand, as: 'brand', attributes: ['title']},
                    {
                        model: models.product_category,
                        as: 'category',
                        attributes: ['id', 'title','slag'],
                        required: true,
                        through: {attributes: []}
                    },
                    {model: models.model, as: "model", attributes: ['title']}
                ]
            })
            return result
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    getProductById: async (id, getByUser) => {
        try {
            if(getByUser){
                await models.product.increment('popular', {by: 1, where: {id: id}});
            }
            let result = await models.product.findOne({
                where: {id: id},
                include: [
                    {model: models.brand, as: 'brand', attributes: ['title']},
                    {
                        model: models.product_category,
                        as: 'category',
                        attributes: ['id', 'title','slag'],
                        through: {attributes: []}
                    },
                    {model: models.model, as: "model", attributes: ['title']},
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
            })
            // result =    JSON.parse(JSON.stringify(result));
           // if(result && result.characteristic && result.characteristic.length > 0) result.characteristic = JSON.parse(result.characteristic)
            if( result && result.gallery) result.gallery = result.gallery.split(",");

            return result.toJSON();
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    getProductBySlag: async (slag, getByUser) => {
        try {
            if(getByUser){
                await models.product.increment('popular', {by: 1, where: {slag: slag}});
            }
            let result = await models.product.findOne({
                where: {slag: slag},
                include: [
                    {model: models.brand, as: 'brand', attributes: ['title']},
                    {
                        model: models.product_category,
                        as: 'category',
                        attributes: ['id', 'title','slag'],
                        through: {attributes: []}
                    },
                    {model: models.model, as: "model", attributes: ['title']},
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
            })
            // result = JSON.parse(JSON.stringify(result));
            // if(result && result.characteristic && result.characteristic.length > 0) result.characteristic = JSON.parse(result.characteristic)
            if( result && result.gallery) result.gallery = result.gallery.split(",");

            return result.toJSON();
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },


    deleteProduct: async (product_ids, trans) => {
        let transaction = null;
        try {

            transaction = trans ? trans : await sequelize.transaction();
            for (let id of product_ids) {
                let product = await models.product.findOne({
                    where: {id: id}
                })
                if (product && product.status == 0) {
                    let deletedProduct = await models.product.findOne({
                        where: {id: id},
                        include: [
                            {
                                model: models.product_variations,
                                as: "product_variations",
                                attributes: variationAttributes
                            }
                        ]
                    })

                    await models.product_to_category.destroy({
                        where: {product_id: id},
                        transaction
                    })

                    for(let variatation of deletedProduct.product_variations){
                        await models.product_to_attribute.destroy({where: {product_variation_id: variatation.id}, transaction});
                        await models.product_variations.destroy({where: {id: variatation.id}, transaction})
                    }
                    await models.product.destroy({
                        where: {id: id},
                        transaction
                    })
                } else {
                    await models.product.update({status: 0}, {where: {id: id}, transaction});
                }
            }
            //Change in db but not return on front

            if (!trans) await transaction.commit();
            let result = await models.product.findAll({
                where: {id: product_ids},
                through: {attributes: []}
            })
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },

    editProduct: async (data, categories, product_variations, id, trans) => {
        let transaction = null;
        try {

            transaction = trans ? trans : await sequelize.transaction();
            let editedProduct = await models.product.findOne({
                where: {id: id},
                include: [
                    {
                        model: models.product_variations,
                        as: "product_variations",
                        attributes: variationAttributes
                    }
                ]
            })
            await models.product.update(data, {where: {id: id}, transaction});
            if(product_variations){
                //DESTROY
                for(let variatation of editedProduct.product_variations){
                    await models.product_to_attribute.destroy({where: {product_variation_id: variatation.id}, transaction});
                }
                await models.product_variations.destroy({where: {product_id: id}, transaction});
                //CREATE
                for (let variation of product_variations) {
                    let prodVar = await models.product_variations.create(
                        {
                            product_id: id,
                            sku: variation.sku,
                            price: variation.price,
                            old_price: variation.old_price,
                        }, {transaction}
                    );
                    for (let atr of variation.attrubutes) {
                        await models.product_to_attribute.create(
                            {
                                attribute_id: atr.id,
                                value: atr.value,
                                product_variation_id: prodVar.id
                            }, {transaction}
                        )
                    }
                }
            }
            if(categories){

                await models.product_to_category.destroy({where: {product_id: id}, transaction});

                for (let catId of categories) {
                    await models.product_to_category.create({product_id: id, product_category_id: catId}, {transaction})
                }
            }

            if (!trans) await transaction.commit();
            let result = await models.product.findOne({
                where: {id: id},
                include: [
                    {model: models.brand, as: 'brand', attributes: ['title']},
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
                    {model: models.model, as: "model", attributes: ['title']}
                ],
                through: {attributes: []}
            })
            return result;
        } catch (err) {
            err.code = 400;
            if (transaction) await transaction.rollback();
            throw err;
        }
    },

    changeProductStatus: async (status, product_ids) => {

        await models.product.update(status, {where: {id: product_ids}});
        let result = await models.product.findAll({
            where: {id: product_ids}
        })
        return result;
    },

// get favorites  for  GET request by user_id
    getFavorites: async (data) => {

        let favorite = await models.product_favorites.findAndCountAll({
            limit:10,
            where: {user_id:data.user_id}
        });
        favorite.rows =  favorite.rows.map(function(item) {
            return item.toJSON();
        })

        for (let i of favorite.rows) {
            if(i.type == 'product')
            {
               const product =   await models.product.findOne({
                   where: {id: i.product_id},
                   include: [
                       {model: models.brand, as: 'brand', attributes: ['title']},
                       {
                           model: models.product_category,
                           as: 'category',
                           attributes: ['id', 'title','slag'],
                           through: {attributes: []}
                       }

                   ]
               })
                i.product = {...product.toJSON()}
            }
            else
                {
             const kit   = await models.product_kit.findOne({
                    where: {id: i.product_id},

                    include: [

                        {
                            model: models.product_kit_category,
                            as: 'as_category_kit_product',
                            attributes: ['id', 'title','slag'],
                            through: {attributes: []}
                        }


                    ],

                })

                    i.product = {...kit.toJSON()}

            }

        }
        return   favorite;
    } ,
// add favorites  for POST ajax request  by user_id and filter
    ajaxFavorites: async (data) => {
         let where = [];
         if(data.title) where = {title:data.title};
        let favorite = await models.product_favorites.findAndCountAll({
            limit:10,
            offset:data.offset,
            where: {user_id:data.user_id}
        });
        favorite.rows =  favorite.rows.map(function(item) {
            return item.toJSON();
        })

        for (let i  of favorite.rows) {

            if(i.type == 'product')
            {
                const product =   await models.product.findOne({
                    where: {id: i.product_id},
                    include: [
                        {
                            model: models.product_category,
                            as: 'category',
                            attributes: ['id', 'title','slag'],
                            through: {attributes: []},
                            where:where
                        }

                    ]
                })
                if(product) { i.product = {...product.toJSON()} };
            }
            else
            {
                const kit   = await models.product_kit.findOne({
                    where: {id: i.product_id},

                    include: [

                        {
                            model: models.product_kit_category,
                            as: 'as_category_kit_product',
                            attributes: ['id', 'title','slag'],
                            through: {attributes: []},
                            where:where
                        }


                    ],

                })
                if(kit)  { i.product = {...kit.toJSON()} };

            }

        }

       favorite.rows = favorite.rows.filter(i => ( i.product ))
        return   favorite;

    },
// add favorites for POST request by  user_id,  product_id , type { kit or product}
    addfavorites: async (data) => {
        await models.product_favorites.destroy( {where : data});
        let result =   await models.product_favorites.create( data);
        return result;
    },
// delete favorites for POST request by  user_id,  product_id , type { kit or product}
    deletefavorites: async (data) => {
        let result =   await models.product_favorites.destroy( {where : data});
        return result;
    },

    checkFavorites: async (data) => {
        let result =   await models.product_favorites.findOne( {where : data});

      return result

    },
    getCountFavorites: async (user_id) => {
        let result =   await models.product_favorites.count( {where : {user_id:user_id}});
        return result
    },
    getSimilarProducts: async (id) => {
        let similar_products  = await  models.product.findAll({where:{similar_products:id,status: 2}});
         return  similar_products.map(function(item) {
             return item.toJSON();
         })
    },
    getSimilarProductsKit: async (id) => {
         console.log(id)
        let similar_products  = await  models.product_kit.findAll({where:{similar_products:id,status: 2}});
         return  similar_products.map(function(item) {
             return item.toJSON();
         })
    },



}
