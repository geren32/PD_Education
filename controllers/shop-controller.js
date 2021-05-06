const { models } = require('../sequelize-orm');
const productService = require('../services/product.service');
const brandService = require('../services/brand.service');
const dealerService = require('../services/dealer.service');
const templateUtil = require('../utils/template-util');
const bookingController = require('../controllers/booking.controller');
const pageService= require('../services/pages.service');
const userService = require('../services/user.service');
const _ = require('lodash');
const currencyValue = 28;

module.exports = {

    async getUserInfo(id, json){
        try {
            if (!id) throw new Error('No id');

            let data = userService.filterUser({id:id});
            //Замінив на функцію вище
            // await models.user.findOne({
            //     where: {
            //         id: id
            //     }
            // });
            if(json)
            //data = JSON.parse(JSON.stringify(data));
            return data.toJSON();

        }catch (e) {
            throw e
        }
    },

    async getAllProducts  (req, res)  {
        let currency = req.currency;
        let {category  , sort, filter, brand, attributes, productIds, } = req.body;
        let perPage = 10;
        let page =  1;
        const offset = perPage * (page - 1);
        const limit = perPage;
        category =  req.params.id
        //TODO: Add pagination
        let allProducts = await productService.getAllProductsShop(category, sort, filter, brand, attributes, productIds,perPage,page,offset,limit);

        for (let i of allProducts.products.rows) {
            if(currency.code == 0) {
                if(i.old_price) i.old_price = (i.old_price*currencyValue).toFixed(2)
                i.price = (i.price*currencyValue).toFixed(2);
                i.product_variations[0].price = (i.product_variations[0].price*currencyValue).toFixed(2);
            }
            if(i.promo_label) i.promo_label = JSON.parse(i.promo_label)
            if(i.gallery) i.gallery = i.gallery.split(",");
            if(i.recommended_products) i.recommended_products = i.recommended_products.split(",");
            if(i.similar_products) i.similar_products = i.similar_products.split(",");
        }
        let attrinuteIds = []
        let brandIds = []
        let categotyProducts = await productService.getAllProductsShop(category)

        for (let p of categotyProducts.products.rows) {
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

        const id = req.user ? req.user.id : null;

        allProducts.products.rows = await allProducts.products.rows.map(function(item) { return item.toJSON();})
        for ( let item of allProducts.products.rows)
        {

            let checkFavorites = await productService.checkFavorites({user_id: id , product_id: item.id , type:'product'})
            if (checkFavorites) {
                item.favourite = true;

            }
        }
        if(currency.code == 0) {
            allProducts.minPrice = (allProducts.minPrice*currencyValue).toFixed(2);
            allProducts.maxPrice = (allProducts.maxPrice*currencyValue).toFixed(2);
        }
        let findedBrands = await brandService.getBrands(brandIds)
        let result = {
            products: allProducts.products,
            attributes: finalAttributes,
            brands: findedBrands,
            minPrice: allProducts.minPrice,
            maxPrice: allProducts.maxPrice,
            category: category ? category : 0,
            page: page ? page : 0,
            user_id: id
        }
        let result_category = await productService.getCategories()
        let result_category_one = await productService.getCategoryBySlag(category)
        const countPages = Math.ceil(result.products.count / perPage);
        result.products.countPages  = countPages
        let seoPage = await models.pages.findOne({where: {template: 'seo'}, raw: true})
        seoPage.sections = JSON.parse(seoPage.sections);

        let dealerHeader;
        let user;
        let cart;
        if(id){
            user = await dealerService.getClientDetail(id);
            dealerHeader = await dealerService.getDealerUser(user.client.dealer_id);
            cart = await bookingController.getCurrentCart(req, res);
        }

        const renderHeader = req.user ? 'client/layout-client-after-login.hbs' : 'client/layout-client.hbs';
        res.render('client/shop/catalog', {

            layout: renderHeader,
            metaData: req.body.metaData,
            dealerData: dealerHeader, //in header
            ...result,
            result_category:result_category,
            result_category_one:result_category_one,
            seoPage: seoPage,
            pagination: {
                page: page,
                pageCount: countPages
            },
            first_name: user ? user.first_name : null,
            last_name: user ? user.last_name : null,
            cart: cart ? cart: null,
            currency: req.currency ? req.currency: null
        });

    },

    async getAllProductsAjax  (req, res)  {
        let currency = req.currency;
        let {category  , sort, filter, brand, attributes, productIds ,page ,perPage} = req.body;
        perPage = perPage ? perPage : 10;
        page = page ? page : 1;
        const offset = perPage * (page - 1);
        const limit = perPage;
        if (filter && filter.price && currency.code == 0) {
            filter.price.from = (filter.price.from/currencyValue).toFixed(2);
            filter.price.to = (filter.price.to/currencyValue).toFixed(2);
        }

        category =  req.params.id
        //TODO: Add pagination
        let allProducts = await productService.getAllProductsShop(category, sort, filter, brand, attributes, productIds,perPage,page,offset,limit);

        //console.log('prod controller ', allProducts.products);
        for (let i of allProducts.products.rows) {
            if(currency.code == 0) {
                if(i.old_price) i.old_price = (i.old_price*currencyValue).toFixed(2)
                i.price = (i.price*currencyValue).toFixed(2);
                i.product_variations[0].price = (i.product_variations[0].price*currencyValue).toFixed(2);
            }
            if(i.promo_label) i.promo_label = JSON.parse(i.promo_label)
            if(i.gallery) i.gallery = i.gallery.split(",");
            if(i.recommended_products) i.recommended_products = i.recommended_products.split(",");
            if(i.similar_products) i.similar_products = i.similar_products.split(",");
        }
        let attrinuteIds = []
        let brandIds = []
        let categotyProducts = await productService.getAllProductsShop(category)

        for (let p of categotyProducts.products.rows) {
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
        const id = req.user ? req.user.id : null;

        allProducts.products.rows = await allProducts.products.rows.map(function(item) { return item.toJSON();})
        for ( let item of allProducts.products.rows)
        {

            let checkFavorites = await productService.checkFavorites({user_id: id , product_id: item.id , type:'product'})
            if (checkFavorites) {
                item.favourite = true;

            }
        }
        if(currency.code == 0) {
            allProducts.minPrice = (allProducts.minPrice*currencyValue).toFixed(2);
            allProducts.maxPrice = (allProducts.maxPrice*currencyValue).toFixed(2);
        }
        let findedBrands = await brandService.getBrands(brandIds)
        let result = {

            products: allProducts.products,
            attributes: finalAttributes,
            brands: findedBrands,
            minPrice: allProducts.minPrice,
            maxPrice: allProducts.maxPrice,
            category: category ? category : 0,
            categotyProducts:categotyProducts,
            currency: currency ? currency: null

        }
        //  res.status(200).json( result );

        // result = JSON.parse(JSON.stringify(result));

        const countPages = Math.ceil(result.products.count / perPage);


        result = await templateUtil.getTemplate({ user_id: id,products: result.products, currency: currency}, 'client/shop/product-requests');
        let  pagination = await templateUtil.getTemplate(
            {
                pagination: {
                    page: page,
                    pageCount: countPages,
                    pageLast: countPages - 3

                },  category: category
            }, 'client/shop/pagination-requests');
        res.send({
            html: result,
            pagination: pagination,
            count:allProducts.products.count
        });

    },

    getCategories: async (req, res) => {
        // let {sort} = req.body;
        // let result = await productService.getProductsForMain(sort)
        // for (const i of result) {
        //     if(i.promo_label) i.promo_label = JSON.parse(i.promo_label)
        //     if(i.gallery) i.gallery = i.gallery.split(",");
        //     if(i.recommended_products) i.recommended_products = i.recommended_products.split(",");
        //     if(i.similar_products) i.similar_products = i.similar_products.split(",");
        // }
        // res.status(200).json( result );
        let result = await productService.getCategories();

         // result = JSON.parse(JSON.stringify(result));

        const id = req.user ? req.user.id : null;
        let dealerHeader;
        let user;
        let cart;
        if(id){
            user = await dealerService.getClientDetail(id);
            dealerHeader = await dealerService.getDealerUser(user.client.dealer_id);
            cart = await bookingController.getCurrentCart(req, res);
        }

        const renderHeader = req.user ? 'client/layout-client-after-login.hbs' : 'client/layout-client.hbs';
        res.render('client/shop/categories', {
            layout: renderHeader,
            dealerData: dealerHeader, //in header
            metaData: req.body.metaData,
            result: result,
            first_name: user ? user.first_name : null,
            last_name: user ? user.last_name : null,
            cart: cart ? cart: null,
            currency: req.currency ? req.currency: null
        });
    },

    getProductById: async (req, res) => {
        let currency = req.currency;
        let slag = req.params.slag
        // let {sort} = req.body;

        // for (const i of result) {
        //     if(i.promo_label) i.promo_label = JSON.parse(i.promo_label)
        //     if(i.gallery) i.gallery = i.gallery.split(",");
        //     if(i.recommended_products) i.recommended_products = i.recommended_products.split(",");
        //     if(i.similar_products) i.similar_products = i.similar_products.split(",");
        // }
        // res.status(200).json( result );

        // let result = await productService.getProductById(slag);

        let result = await productService.getProductBySlag(slag);

        const id = req.user ? req.user.id : null;

        if(result.product_variations) result.variation = result.product_variations[0];
        if(currency.code == 0) {
            if(result.old_price) result.old_price = (result.old_price*currencyValue).toFixed(2)
            result.price = (result.price*currencyValue).toFixed(2);
            if(result.product_variations) {
                result.product_variations.price = (result.product_variations.price*currencyValue).toFixed(2);
            }
        }
        let dealerHeader;
        let user;
        let cart;
        if(id){
            user = await dealerService.getClientDetail(id);
            dealerHeader = await dealerService.getDealerUser(user.client.dealer_id);
            cart = await bookingController.getCurrentCart(req, res);
        }
        let similar_products = await productService.getSimilarProducts(result.id);
        const renderHeader = req.user ? 'client/layout-client-after-login.hbs' : 'client/layout-client.hbs';
        let checkFavorites = await productService.checkFavorites({user_id: id , product_id: result.id , type:'product'})
        res.render('client/shop/product-detail', {
            layout: renderHeader,
            dealerData: dealerHeader, //in header
            metaData: req.body.metaData,
            ...result,
            first_name: user ? user.first_name : null,
            last_name: user ? user.last_name : null,
            cart: cart ? cart: null,
            currency: req.currency ? req.currency: null,
            favourite:checkFavorites,
            similar_products:similar_products,
        });
    },

    getProductKitById: async (req, res) => {
        let currency = req.currency;
        let slag = req.params.slag;

        // let result = await productService.getProductKitById(slag);
        let result = await productService.getProductKitBySlag(slag);
        result.as_product_kit =  _.groupBy(result.as_product_kit, 'product_to_kit.substitute');
        let seoPage = await models.pages.findOne({where: {template: 'seo'}, raw: true});
        seoPage.sections = JSON.parse(seoPage.sections);
        if(currency.code == 0) {
            if(result.old_price) result.old_price = (result.old_price*currencyValue).toFixed(2)
            result.price = (result.price*currencyValue).toFixed(2)
        }

        const id = req.user ? req.user.id : null;
        let dealerHeader;
        let user;
        let cart;
        if(id){
            user = await dealerService.getClientDetail(id);
            dealerHeader = await dealerService.getDealerUser(user.client.dealer_id);
            cart = await bookingController.getCurrentCart(req, res);
        }
        let similar_products = await productService.getSimilarProductsKit(result.id);
        let checkFavorites = await productService.checkFavorites({user_id: id , product_id: result.id , type:'kit'})
        const renderHeader = req.user ? 'client/layout-client-after-login.hbs' : 'client/layout-client.hbs';
        res.render('client/shop/product-detail-kit', {
            layout: renderHeader,
            dealerData: dealerHeader, //in header
            metaData: req.body.metaData,
            ...result,
            seoPage: seoPage,
            first_name: user ? user.first_name : null,
            last_name: user ? user.last_name : null,
            cart: cart ? cart : null,
            currency: req.currency ? req.currency: null,
            favourite:checkFavorites,
            similar_products:similar_products
        });
    },
    getCategoriesKit: async (req, res) => {
        let result = await productService.getCategoriesKit();
        let seoPage = await models.pages.findOne({where: {template: 'seo'}, raw: true});
        seoPage.sections = JSON.parse(seoPage.sections);

        const id = req.user ? req.user.id : null;
        let dealerHeader;
        let user;
        let cart;
        if(id){
            user = await dealerService.getClientDetail(id);
            dealerHeader = await dealerService.getDealerUser(user.client.dealer_id);
            cart = await bookingController.getCurrentCart(req, res);
        }

        const renderHeader = req.user ? 'client/layout-client-after-login.hbs' : 'client/layout-client.hbs';
        res.render('client/shop/categories-kit', {
            layout: renderHeader,
            dealerData: dealerHeader, //in header
            metaData: req.body.metaData,
            result:result,
            seoPage: seoPage,
            first_name: user ? user.first_name : null,
            last_name: user ? user.last_name : null,
            cart: cart ? cart: null,
            currency: req.currency ? req.currency: null
        });
    },

    getAllProductsKit: async (req, res) => {
        let currency = req.currency;
        let {category  , sort, filter, brand, attributes, productIds, } = req.body;
        let perPage = 10;
        let page =  1;
        const offset = perPage * (page - 1);
        const limit = perPage;

        category =  req.params.slag
        //TODO: Add pagination
        let allProducts = await productService.getAllProductsKitShop(category, sort, filter, brand, attributes, productIds,perPage,page,offset,limit);


        for (let i of allProducts.products.rows) {
            if(currency.code == 0) {
                i.price = (i.price*currencyValue).toFixed(2)
                if(i.old_price) i.old_price = (i.old_price*currencyValue).toFixed(2)
            }
            if(i.promo_label) i.promo_label = JSON.parse(i.promo_label)
            if(i.gallery) i.gallery = i.gallery.split(",");
            if(i.recommended_products) i.recommended_products = i.recommended_products.split(",");
            if(i.similar_products) i.similar_products = i.similar_products.split(",");
        }
        let attrinuteIds = []
        let brandIds = []
        let categotyProducts = allProducts
        if(categotyProducts)
        {
            for (let p of categotyProducts.products.rows) {
                if (p.as_product_kit_to_attribute) {
                    for (let v of p.as_product_kit_to_attribute) {

                        attrinuteIds.push({
                            id: v.id,
                            value: v.activeValue.value,
                            title: v.title,
                            status: v.status,
                            type: v.type
                        })

                    }
                    brandIds.push(p.brand_id);
                }
            }
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
        const id = req.user ? req.user.id : null;
        let dealerHeader;
        let user;
        let cart;
        if(id){
            user = await dealerService.getClientDetail(id);
            dealerHeader = await dealerService.getDealerUser(user.client.dealer_id);
            cart = await bookingController.getCurrentCart(req, res);
        }
        allProducts.products.rows = allProducts.products.rows.map(function(item) { return item.toJSON();})
         for ( let item of allProducts.products.rows)
         {
             let checkFavorites = await productService.checkFavorites({user_id: id , product_id: item.id , type:'kit'})
              if (checkFavorites) {
                 item.favourite = true;
             }
         }

        if(currency.code == 0) {
            allProducts.minPrice = (allProducts.minPrice*currencyValue).toFixed(2);
            allProducts.maxPrice = (allProducts.maxPrice*currencyValue).toFixed(2);
        }
        let findedBrands = await brandService.getBrands(brandIds)
        let result = {
            products: allProducts.products,
            attributes: finalAttributes,
            brands: findedBrands,
            minPrice: allProducts.minPrice,
            maxPrice: allProducts.maxPrice,
            category: category ? category : 0,
            page: page ? page : 0
        }


        // result.rows = result.products.rows.map((item) => item.toJSON())



        const countPages = Math.ceil(result.products.count / perPage);
        result.products.countPages  = countPages

        let result_category = await productService.getCategoriesKit()

        let result_category_one = await productService.getCategoryKitBySlag(category)

        let seoPage = await models.pages.findOne({where: {template: 'seo'}, raw: true})
        seoPage.sections = JSON.parse(seoPage.sections);



        const renderHeader = req.user ? 'client/layout-client-after-login.hbs' : 'client/layout-client.hbs';
        res.render('client/shop/catalog-kit', {
            user_id: id,
            layout: renderHeader,
            dealerData: dealerHeader, //in header
            metaData: req.body.metaData,
            ...result,
            result_category:result_category,
            result_category_one:result_category_one,
            seoPage: seoPage,
            pagination: {
                page: page,
                pageCount: countPages
            },
            first_name: user ? user.first_name : null,
            last_name: user ? user.last_name : null,
            cart: cart ? cart: null,
            currency: req.currency ? req.currency: null

        });
    },
    getAllProductsKitAjax : async (req, res) => {
        let currency = req.currency;
        let {category  , sort, filter, brand, attributes, productIds, page} = req.body;
        let perPage = 10;
        // let page =  1;
        const offset = perPage * (page - 1);
        const limit = perPage;
        if (filter && filter.price && currency.code == 0) {
            filter.price.from = (filter.price.from/currencyValue).toFixed(2);
            filter.price.to = (filter.price.to/currencyValue).toFixed(2);
        }

        category =  req.params.slag
        //TODO: Add pagination
        let allProducts = await productService.getAllProductsKitShop(category, sort, filter, brand, attributes, productIds,perPage,page,offset,limit);

        for (let i of allProducts.products.rows) {
            if(currency.code == 0) {
                if(i.old_price) i.old_price = (i.old_price*currencyValue).toFixed(2)
                i.price = (i.price*currencyValue).toFixed(2);
            }
            if(i.promo_label) i.promo_label = JSON.parse(i.promo_label)
            if(i.gallery) i.gallery = i.gallery.split(",");
            if(i.recommended_products) i.recommended_products = i.recommended_products.split(",");
            if(i.similar_products) i.similar_products = i.similar_products.split(",");
        }
        let attrinuteIds = []
        let brandIds = []
        let categotyProducts = allProducts
        if(categotyProducts)
        {
            for (let p of categotyProducts.products.rows) {
                if (p.as_product_kit_to_attribute) {
                    for (let v of p.as_product_kit_to_attribute) {

                        attrinuteIds.push({
                            id: v.id,
                            value: v.activeValue.value,
                            title: v.title,
                            status: v.status,
                            type: v.type
                        })

                    }
                    brandIds.push(p.brand_id);
                }
            }
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
        let countPages = Math.ceil(allProducts.products.count / perPage);
        const id = req.user ? req.user.id : null;

        allProducts.products.rows = allProducts.products.rows.map(function(item) { return item.toJSON();})
        for ( let item of allProducts.products.rows)
        {

            let checkFavorites = await productService.checkFavorites({user_id: id , product_id: item.id , type:'kit'})
            if (checkFavorites) {
                item.favourite = true;
            }
        }
        if(currency.code == 0) {
            allProducts.minPrice = (allProducts.minPrice*currencyValue).toFixed(2);
            allProducts.maxPrice = (allProducts.maxPrice*currencyValue).toFixed(2);
        }
        let result = {
            user_id: id,
            products: allProducts.products,
            attributes: finalAttributes,
            brands: findedBrands,
            minPrice: allProducts.minPrice,
            maxPrice: allProducts.maxPrice,
            category: category ? category : 0,
            page: page ? page : 0,
            countPages:countPages
        }


        // result =    JSON.parse(JSON.stringify(result));
    // result= result.map(function(item) {
    //         return item.toJSON();
    //     });

        result = await templateUtil.getTemplate({products: result.products,user_id: id, currency:currency}, 'client/shop/product-kit-requests');
        let  pagination = await templateUtil.getTemplate({pagination: {
                page: page,
                pageCount: countPages,
                pageLast: countPages - 3
            },  category: category }, 'client/shop/pagination-requests');
        res.send({
            html: result,
            pagination: pagination,
            count:allProducts.products.count
        });
    }
}

