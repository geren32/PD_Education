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

module.exports = {
     createVariation: async (variation, attrubutes) => {
        try {

            let prodVar = await models.product_variations.create(
                {
                    product_id: variation.product_id,
                    sku: variation.sku,
                    gallery: variation.gallery ? variation.gallery.toString() : null,
                    price: variation.price,
                    old_price: variation.old_price,
                    promotional: variation.promotional,
                    quantity: variation.quantity
                }, //{transaction}
            );
            for (const atr of attrubutes) {
                await models.product_to_attribute.create(
                    {
                        attribute_id: atr.id,
                        value: atr.value,
                        product_variation_id: prodVar.id
                    }, //{transaction}
                )
            }
            let result = await models.product_variations.findOne({
                where: {id: prodVar.id},
                include: [
                    {
                        model: models.attribute,
                        as: 'attribute',
                        attributes: ['id', 'title', 'value', 'status', 'type'],
                        through: {attributes: ['value'], as: 'activeValue'}
                    }
                ]
            })

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     deleteVariation: async (id) => {
        try {

            await models.product_to_attribute.destroy({where: {product_variation_id: id}});
            let result = await models.product_variations.destroy({
                where: {id: id}
            })
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     changeVariationStatus: async (variation_id, product_id) => {
        //Change status fot active settings
        await models.product_variations.update({status: false}, {where: {status: true, product_id: product_id}})
        //Change status fot current settings
        await models.product_variations.update({status: true}, {where: {id: variation_id, product_id: product_id}, returning: true})
        let variation = await models.product_variations.findOne({
            where: {id: variation_id, product_id: product_id}
        })
        let product = await models.product.update({price: variation.price, promotional: variation.promotional}, {where: {id: product_id}})

        return variation;
    },
     editVariation: async (id, variation) => {
        try {

            await models.product_variations.update(variation, {where: {id}})
            let result = await models.product_variations.findOne({
                where: {id: id}
            })
            return result

        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
     getVariationById: async (id) => {
        try {

            let result = await models.product_variations.findOne({
                where: {id: id},
                include: [
                    {
                        model: models.attribute,
                        as: 'attribute',
                        attributes: ['id', 'title', 'value', 'status', 'type'],
                        through: {attributes: ['value'], as: 'activeValue'}
                    }
                ]
            });
        // JSON.parse(JSON.stringify(result));

       //toJson()
        return result
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

}
