const jwt = require('jsonwebtoken');

const service = require('../services/blog.service');
const dealerService = require('../services/dealer.service');
const pagesService = require('../services/pages.service');
const { models } = require('../sequelize-orm');
const userService = require('../services/user.service');
const productService = require('../services/product.service');
const { Op } = require("sequelize");
const fs = require('fs');
const config = require('../configs/config');
const templateUtil = require('../utils/template-util');
const bookingController = require('../controllers/booking.controller');

function searchFields(field) {
        let like = [];
        like.push({[Op.like]: `%${field}%`});
        return like
    // if (searchField && searchField.length) {
    //     let like = [];
    //     searchField.forEach((item) => {
    //         like.push({[Op.like]: `%${item}%`});
    //     });
    //     return like
    // }
}

async function productsSearch(field, count, page) {
        let like = searchFields(field)
    let offset = count * (page - 1);
        let where = [{status: 2},{[Op.or]: [ {name: { [Op.or]: like }}]}];
        return await models.product.findAndCountAll({where: where, limit: count, offset: offset, distinct: true, raw: true, attributes:['name','image','sku','slag']})
}
async function productKitsSearch(field, count, page) {
    let like = searchFields(field)
    let offset = count * (page - 1);
    let where = [{status: 2},{[Op.or]: [ {name: { [Op.or]: like }}]}];
    return await models.product_kit.findAndCountAll({where: where, limit: count, offset: offset, distinct: true, raw: true, attributes:['name','image','sku','slag']})
}
async function newsSearch(field, count, page) {
    let like = searchFields(field)
    let offset = count * (page - 1);
    let where = [{status: 1},{[Op.or]: [ {title: { [Op.or]: like }}]}];
    return await models.posts.findAndCountAll({where: where, limit: count, offset: offset, raw: true, attributes:['title','image_id','slag'], include:{model: models.uploaded_images, as: 'image'}})
}

module.exports = {
    searchItems: async (req, res) => {
        console.log(req.body)
        try {
            let {search} = req.body;
            let result =[];
            let products =  await productsSearch(search, 10,1);
            products.rows.forEach(product => {
                product.value = product.name;
                product.category = 'ВИРОБИ'
                result.push(product);
            })
            // if(products && products.length) result.push(products);
            let kits = await productKitsSearch(search,10,1);
            kits.rows.forEach(kit => {
                kit.value = kit.name;
                kit.category = 'КОМПЛЕКТИ'
                result.push(kit);
            })
            // if(kits && kits.length) result.push(kits);
            let news = await newsSearch(search,10,1);
            news.rows.forEach(newsRow => {
                newsRow.sku = '';
                if(newsRow.image) newsRow.image = newsRow.image.filename;
                newsRow.value = newsRow.title;
                newsRow.category = 'НОВИНИ'
                result.push(newsRow);
            })
            // if(news && news.length) result.push(news);
            console.log(result);
            res.json(result);
        } catch (e) {
            res.status(400).json({
                message: e.message,
                errCode: '400'
            });
        }
    },
    searchItemsFull: async (req, res) => {
        let perPage = req.body.items_per_page ? parseInt(req.body.items_per_page) : 10;
        let page = req.params.page ? parseInt(req.params.page) : 1;
        console.log(req.body)
        try {
            let {search, type} = req.body;
            console.log(req.body);
            let items = [];
            let count;
            if(type) {
                if(type === 'products') {

                } else if(type === 'kits') {

                } else if(type === 'news') {

                }
            } else {
                let products = await productsSearch(search, perPage, page);
                items.push({item: products.rows, type: 'products'});
                if(products.rows.length < perPage) {
                    let itemPage = page - Math.ceil(products.count/perPage);
                    if(itemPage == 0) itemPage = 1;
                    let countOfItems = perPage-products.rows.length
                    let kits = await productKitsSearch(search, countOfItems, itemPage);
                    items.push({item: kits.rows, type: 'kits'});
                    if(kits.rows.length < perPage) {
                        let itemPage1 = itemPage - Math.ceil(kits.count/perPage);
                        if(itemPage1 == 0) itemPage1 = 1;
                        countOfItems = perPage-kits.rows.length
                        let news = await newsSearch(search, countOfItems, itemPage1);
                        items.push({item: news.rows, type: 'news'});
                    }
                }
                let kits = await productKitsSearch(search, 1, 1);
                let news = await newsSearch(search, 1, 1);
                count = products.count + kits.count + news.count;
            }

            const countPages = Math.ceil(count / perPage);
            let minPage, maxPage;
            let lastElem = true;
            if(page >= 2 && page <= countPages-8) {
                minPage = page-2;
                if(page === 2) minPage = page-1;
            } else minPage = countPages-9
            if(page+9 > countPages) {
                maxPage = countPages;
            } else maxPage = page+9;
            if(maxPage === countPages) lastElem = false;
            if(minPage < 1) minPage = 1;

            console.log(items)
            console.log(count)
            const id = req.user ? req.user.id : null;
            let dealerHeader;
            let user;
            let cart;
            if(id){
                cart = await bookingController.getCurrentCart(req, res);
                user = await dealerService.getClientDetail(id);
                dealerHeader = await dealerService.getDealerUser(user.client.dealer_id);
            }
            const renderHeader = req.user ? 'client/layout-client-after-login.hbs' : 'client/layout-client.hbs';
            res.render('client/search', {
                metaData: req.body.metaData,
                layout: renderHeader,
                dealerData: dealerHeader, //in header
                items: items,
                count: count,
                search: search,
                countPages: countPages,
                pagination: {page, max: maxPage, min: minPage, lastElem},
                first_name: user ? user.first_name : null,
                last_name: user ? user.last_name : null,
                cart: cart ? cart: null,
                currency: req.currency ? req.currency: null
            });
        } catch (e) {
            console.log(e)
            res.status(400).json({
                message: e.message,
                errCode: '400'
            });
        }
    },
    searchItemsAjax: async (req, res) =>{
        let perPage = req.body.items_per_page ? parseInt(req.body.items_per_page) : 10;
        let page = req.body.current_page ? parseInt(req.body.current_page) : 1;
        console.log(req.body)
        try {
            let {search, type} = req.body;
            console.log(req.body);
            let items = [];
            let count;
            if(type) {
                if(type === 'products') {
                    let products = await productsSearch(search, perPage, page);
                    items.push({item: products.rows, type: 'products'});
                    count = products.count;
                } else if(type === 'kits') {
                    let kits = await productKitsSearch(search, perPage, page);
                    items.push({item: kits.rows, type: 'kits'});
                    count = kits.count;
                } else if(type === 'news') {
                    let news = await newsSearch(search, perPage, page);
                    items.push({item: news.rows, type: 'news'});
                    count = news.count;
                }
            } else {
                let products = await productsSearch(search, perPage, page);
                items.push({item: products.rows, type: 'products'});
                if(products.rows.length < perPage) {
                    let itemPage = page - Math.ceil(products.count/perPage);
                    if(itemPage == 0) itemPage = 1;
                    let countOfItems = perPage-products.rows.length
                    let kits = await productKitsSearch(search, countOfItems, itemPage);
                    items.push({item: kits.rows, type: 'kits'});
                    if(kits.rows.length < perPage) {
                        let itemPage1 = itemPage - Math.ceil(kits.count/perPage);
                        if(itemPage1 == 0) itemPage1 = 1;
                        countOfItems = perPage-kits.rows.length
                        let news = await newsSearch(search, countOfItems, itemPage1);
                        items.push({item: news.rows, type: 'news'});
                    }
                }
                let kits = await productKitsSearch(search, 1, 1);
                let news = await newsSearch(search, 1, 1);
                count = products.count + kits.count + news.count;
            }

            const countPages = Math.ceil(count / perPage);
            let minPage, maxPage;
            let lastElem = true;
            if(page >= 2 && page <= countPages-8) {
                minPage = page-2;
                if(page === 2) minPage = page-1;
            } else minPage = countPages-9
            if(page+9 > countPages) {
                maxPage = countPages;
            } else maxPage = page+9;
            if(maxPage === countPages) lastElem = false;
            if(minPage < 1) minPage = 1;

            console.log(items)
            console.log(count)
            let html = await templateUtil.getTemplate({
                items: items,
                count: count,
                search: search,
                type: type,
                countPages: countPages,
                pagination: {page, max: maxPage, min: minPage, lastElem}
            }, 'client/search-request')
            res.json({
                type: type,
                html,
                countPages: countPages,
                pagination: {page, max: maxPage, min: minPage, lastElem}
            })
        } catch (e) {
            console.log(e)
            res.status(400).json({
                message: e.message,
                errCode: '400'
            });
        }
    },

    // searchItemsJson: async (req, res) =>{
    //     let perPage = req.body.items_per_page ? parseInt(req.body.items_per_page) : 10;
    //     let page = req.body.current_page ? parseInt(req.body.current_page) : 1;
    //     try {
    //         let {search, type} = req.body;
    //         console.log(req.body);
    //         let items = [];
    //         let count;
    //         if(type) {
    //             if(type === 'products') {
    //                 let products = await productsSearch(search, perPage, page);
    //                 items.push({item: products.rows, type: 'products'});
    //                 count = products.count;
    //             } else if(type === 'kits') {
    //                 let kits = await productKitsSearch(search, perPage, page);
    //                 items.push({item: kits.rows, type: 'kits'});
    //                 count = kits.count;
    //             } else if(type === 'news') {
    //                 let news = await newsSearch(search, perPage, page);
    //                 items.push({item: news.rows, type: 'news'});
    //                 count = news.count;
    //             }
    //         } else {
    //             let products = await productsSearch(search, perPage, page);
    //             items.push({item: products.rows, type: 'products'});
    //             if(products.rows.length < perPage) {
    //                 let itemPage = page - Math.ceil(products.count/perPage);
    //                 if(itemPage == 0) itemPage = 1;
    //                 let countOfItems = perPage-products.rows.length
    //                 let kits = await productKitsSearch(search, countOfItems, itemPage);
    //                 items.push({item: kits.rows, type: 'kits'});
    //                 if(kits.rows.length < perPage) {
    //                     let itemPage1 = itemPage - Math.ceil(kits.count/perPage);
    //                     if(itemPage1 == 0) itemPage1 = 1;
    //                     countOfItems = perPage-kits.rows.length
    //                     let news = await newsSearch(search, countOfItems, itemPage1);
    //                     items.push({item: news.rows, type: 'news'});
    //                 }
    //             }
    //             let kits = await productKitsSearch(search, 1, 1);
    //             let news = await newsSearch(search, 1, 1);
    //             count = products.count + kits.count + news.count;
    //         }
    //         console.log(items)
    //         console.log(count)
    //         res.json({
    //             items: items,
    //             count: count,
    //         })
    //     } catch (e) {
    //         console.log(e)
    //         res.status(400).json({
    //             message: e.message,
    //             errCode: '400'
    //         });
    //     }
    // }

}
