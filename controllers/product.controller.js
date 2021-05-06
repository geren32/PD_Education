const sequelize = require('../sequelize-orm');
const productService = require('../services/product.service');
const brandService = require('../services/brand.service');

module.exports = {

    getAllProducts: async (req, res) => {
        let {category, sort, filter, brand, attributes, productIds} = req.body;
        //TODO: Add pagination
        let allProducts = await productService.getAllProducts(category, sort, filter, brand, attributes, productIds);
        //console.log('prod controller ', allProducts.products);
        for (let i of allProducts.products) {
            if(i.promo_label) i.promo_label = JSON.parse(i.promo_label)
            if(i.gallery) i.gallery = i.gallery.split(",");
            if(i.recommended_products) i.recommended_products = i.recommended_products.split(",");
            if(i.similar_products) i.similar_products = i.similar_products.split(",");
        }
        let attrinuteIds = []
        let brandIds = []
        let categotyProducts = await productService.getAllProducts(category)

        for (let p of categotyProducts.products) {
            for(let v of p.product_variations) {
                for (let a of v.attribute) {
                    attrinuteIds.push({id: a.id, value: a.activeValue.value, title: a.title, status: a.status, type: a.type})
                }
            }
            brandIds.push(p.brand_id);
        }
        attrinuteIds = _(attrinuteIds)
            .uniqBy(v => [v.id, v.value].join())
            .value();
        attrinuteIds =  _.groupBy(attrinuteIds, 'id');
        let finalAttributes = []
        for (let property in attrinuteIds) {
            let attribute = {}
            let arrOfAttr = attrinuteIds[property];
            attribute.id = property
            attribute.value = _.sortBy(arrOfAttr, 'value').map(i => i.value);
            attribute.title = arrOfAttr[0].title
            attribute.status = arrOfAttr[0].status
            attribute.type = arrOfAttr[0].type
            finalAttributes.push(attribute);
        }
        brandIds = _.uniq(brandIds);
        // let findedAttributes = await mysqlClient.getAttributes(attrinuteIds)
        // for (const atr of findedAttributes) {
        //     atr.value = JSON.parse(atr.value)
        // }
        let findedBrands = await brandService.getBrands(brandIds)
        let result = {
            products: allProducts.products,
            attributes: finalAttributes,
            brands: findedBrands,
            minPrice: allProducts.minPrice,
            maxPrice: allProducts.maxPrice
        }
       return res.status(200).json( result );
        
    },

    getCategories: async (req, res) => {
        let {sort} = req.body;
        let result = await productService.getProductsForMain(sort)
        for (let i of result) {
            if(i.promo_label) i.promo_label = JSON.parse(i.promo_label)
            if(i.gallery) i.gallery = i.gallery.split(",");
            if(i.recommended_products) i.recommended_products = i.recommended_products.split(",");
            if(i.similar_products) i.similar_products = i.similar_products.split(",");
        }
       return res.status(200).json( result );
        
    },




}
