const jwt = require('jsonwebtoken');

const service = require('../services/blog.service');
const dealerService = require('../services/dealer.service');
const pagesService = require('../services/pages.service');
const { models } = require('../sequelize-orm');
const userService = require('../services/user.service');
const { Op } = require("sequelize");
const fs = require('fs');
const config = require('../configs/config');
const templateUtil = require('../utils/template-util');
const bookingController = require('../controllers/booking.controller');

module.exports = {

    getPostByCategory: async (req, res) => {
        // let page = req.body.current_page ? parseInt(req.body.current_page) : 1;
        let perPage = req.body.items_per_page ? parseInt(req.body.items_per_page) : 6;
        let page = req.params.page ? parseInt(req.params.page) : 1;
        // page = 2;
        let body = req.body;
        body.id = 1;
        let posts = await service.getPostByCategory(body,perPage,page);
        if(posts && posts.posts && posts.posts.length ){
            for(let post of posts.posts){
               // post.createdAt = post.createdAt.split('T')[0].replace(/-/g,'.');
                post.createdAt = post.createdAt;
                if(post.slag) post.id = post.slag;
            }
        }
        let newPosts = [];
        for (let i=0; i < posts.posts.length; ++i){
            let firstObj = {
                id: posts.posts[i].id,
                title: posts.posts[i].title,
                subtitle: posts.posts[i].subtitle,
                image: posts.posts[i].image,
                body: posts.posts[i].body,
                status: posts.posts[i].status,
                position: posts.posts[i].position,
                created_user_id: posts.posts[i].created_user_id,
                updated_user_id: posts.posts[i].updated_user_id,
                type: posts.posts[i].type,
                createdAt: posts.posts[i].createdAt,
                updatedAt: posts.posts[i].updatedAt
            }
            let lastObj;
            if(posts.posts[i+1]) {
                lastObj = {
                    id: posts.posts[i+1].id,
                    title: posts.posts[i+1].title,
                    image: posts.posts[i+1].image,
                    body: posts.posts[i+1].body,
                    subtitle: posts.posts[i+1].subtitle,
                    status: posts.posts[i+1].status,
                    position: posts.posts[i+1].position,
                    created_user_id: posts.posts[i+1].created_user_id,
                    updated_user_id: posts.posts[i+1].updated_user_id,
                    type: posts.posts[i+1].type,
                    createdAt: posts.posts[i+1].createdAt,
                    updatedAt: posts.posts[i+1].updatedAt
                }
                firstObj.lastObjStatus = 1;
            }
            i = ++i;
            firstObj.lastObj = lastObj;
            newPosts.push(firstObj);
        }
        const countPages = Math.ceil(posts.count / perPage);
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
        res.render('client/blog/category', {
            metaData: req.body.metaData,
            layout: renderHeader,
            dealerData: dealerHeader, //in header
            // ...posts
            posts: newPosts,
            countPages: countPages,
            pagination: {page, max: maxPage, min: minPage, lastElem},
            first_name: user ? user.first_name : null,
            last_name: user ? user.last_name : null,
            cart: cart ? cart: null,
            currency: req.currency ? req.currency: null
            // ...result
        });
    },
    getPostByCategoryAjax: async (req, res) => {
        // let page = req.body.current_page ? parseInt(req.body.current_page) : 1;
        let perPage = req.body.perPage ? parseInt(req.body.perPage) : 6;
        let page = req.body.current_page ? parseInt(req.body.current_page) : 1;
        // page = 2;
        let body = req.body;
        body.id = 1;
        let posts = await service.getPostByCategory(body,perPage,page);
        if(posts && posts.posts && posts.posts.length ){
            for(let post of posts.posts){
                post.createdAt = post.createdAt.split('T')[0].replace(/-/g,'.');
                if(post.slag) post.id = post.slag;
            }
        }
        let newPosts = [];
        for (let i=0; i < posts.posts.length; ++i){
            let firstObj = {
                id: posts.posts[i].id,
                title: posts.posts[i].title,
                subtitle: posts.posts[i].subtitle,
                image: posts.posts[i].image,
                body: posts.posts[i].body,
                status: posts.posts[i].status,
                position: posts.posts[i].position,
                created_user_id: posts.posts[i].created_user_id,
                updated_user_id: posts.posts[i].updated_user_id,
                type: posts.posts[i].type,
                createdAt: posts.posts[i].createdAt,
                updatedAt: posts.posts[i].updatedAt
            }
            let lastObj;
            if(posts.posts[i+1]) {
                lastObj = {
                    id: posts.posts[i+1].id,
                    title: posts.posts[i+1].title,
                    image: posts.posts[i+1].image,
                    body: posts.posts[i+1].body,
                    subtitle: posts.posts[i+1].subtitle,
                    status: posts.posts[i+1].status,
                    position: posts.posts[i+1].position,
                    created_user_id: posts.posts[i+1].created_user_id,
                    updated_user_id: posts.posts[i+1].updated_user_id,
                    type: posts.posts[i+1].type,
                    createdAt: posts.posts[i+1].createdAt,
                    updatedAt: posts.posts[i+1].updatedAt
                }
                firstObj.lastObjStatus = 1;
            }
            i = ++i;
            firstObj.lastObj = lastObj;
            newPosts.push(firstObj);
        }
        const countPages = Math.ceil(posts.count / perPage);
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

        const id = req.user ? req.user.id : null;
        let dealerHeader;
        let user;
        if(id){
            user = await dealerService.getClientDetail(id);
            dealerHeader = await dealerService.getDealerUser(user.client.dealer_id);
        }
        const renderHeader = req.user ? 'client/layout-client-after-login.hbs' : 'client/layout-client.hbs';
        let  pagination = await templateUtil.getTemplate(
            {
                countPages: countPages,
                pagination: {page: page, max: maxPage, min: minPage, lastElem: lastElem}
            }, 'partials/pagination-blog');

        let html = await templateUtil.getTemplate(
            {
                posts: newPosts,
            }, 'client/blog/category-ajax');
        res.send({
            html: html,
            pagination: pagination,
        })
        // res.render('client/blog/category', {
        //     layout: renderHeader,
        //     dealerData: dealerHeader, //in header
        //     // ...posts
        //     posts: newPosts,
        //     countPages: countPages,
        //     pagination: {page, max: maxPage, min: minPage, lastElem},
        //     first_name: user ? user.first_name : null,
        //     last_name: user ? user.last_name : null,
        //     // ...result
        // });
    },

    getPost: async (req, res) => {
        try {
            if (!req.params.id) throw new Error('Some field is empty');
            let id = req.params.id;
            let renderPage = 'client/blog/post';
            let post;
            let adminRole;
            //const token = req.get('Authorization');
            const token = req.cookies['jwt'];
            if (token) {
                let isTokenValid;
                jwt.verify(token, config.JWT_SECRET_ADMIN, {}, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    isTokenValid = true;
                });
                let user = await userService.getUser({ access_token: token })
                if(user && isTokenValid){
                    adminRole = user.type;
                }
            }
            if (adminRole == config.SUPER_ADMIN_ROLE){
                post = await service.getBlogPostById(id, [config.GLOBAL_STATUSES.ACTIVE, config.GLOBAL_STATUSES.WAITING]);
                if(!post)  post = await service.getBlogPostBySlug(id, [config.GLOBAL_STATUSES.ACTIVE, config.GLOBAL_STATUSES.WAITING]);
            }else{
                post = await service.getBlogPostById(id, config.GLOBAL_STATUSES.ACTIVE);
                if(!post)  post = await service.getBlogPostBySlug(id, config.GLOBAL_STATUSES.ACTIVE);
            }
            if(!post) {
                res.status(403);
                renderPage = './404-V2';
            } else {
                if(post.body )post.body = JSON.parse(post.body);
                // post.body = post.body[0];
                if(post.banner) post.banner = JSON.parse(post.banner);
                // post.createdAt = post.createdAt.split('T')[0].replace(/-/g,'.');
            }

            const idUser = req.user ? req.user.id : null;
            let dealerHeader;
            let user;
            let cart;
            if(idUser){
                user = await dealerService.getClientDetail(idUser);
                dealerHeader = await dealerService.getDealerUser(user.client.dealer_id);
                cart = await bookingController.getCurrentCart(req, res);
            }

            const renderHeader = req.user ? 'client/layout-client-after-login.hbs' : 'client/layout-client.hbs';
            res.render(renderPage, {
                metaData: req.body.metaData,
                layout: renderHeader,
                dealerData: dealerHeader, //in header
                post: post,
                first_name: user ? user.first_name : null,
                last_name: user ? user.last_name : null,
                cart: cart ? cart: null,
                currency: req.currency ? req.currency: null
            });
            return

        } catch (e) {
            res.status(400).json({
                message: e.message,
                errCode: '400'
            });
           }
        },

    // getDealers: async (req, res) => {
    //     // let page = await pagesService.getBlogPageBySlag('dealers');
    //     let page = await pagesService.getPage({type: 'dealers-page', status: 1});
    //     let dealerPages = await pagesService.getBlogPageAll({type: 'dealer', status: 1});
    //     page.sections = JSON.parse(page.sections);
    //     if(page.body) page.body = JSON.parse(page.body);
    //     let dealers = [];
    //     dealerPages.forEach(dealerPage => {
    //         dealerPage.body = JSON.parse(dealerPage.body);
    //         let dealer = {};
    //         dealer.marker_title = dealerPage.body.marker_title;
    //         dealer.email = dealerPage.body.email;
    //         dealer.phone = dealerPage.body.phone;
    //         dealer.marker_text = dealerPage.body.marker_text;
    //         dealer.background_image = dealerPage.body.map_background_image;
    //         dealer.map_image = dealerPage.body.map_image;
    //         dealer.map_image_active = dealerPage.body.map_image_active;
    //         dealer.link_page = dealerPage.slag;
    //         dealer.lat = dealerPage.body.lat;
    //         dealer.lng = dealerPage.body.lng;
    //         dealers.push(dealer);
    //     })
    //
    //     const id = req.user ? req.user.id : null;
    //     let dealerHeader;
    //     let user;
    //     if(id){
    //         user = await dealerService.getClientDetail(id);
    //         dealerHeader = await dealerService.getDealerUser(user.client.dealer_id);
    //     }
    //
    //     const renderHeader = req.user ? 'client/layout-client-after-login.hbs' : 'client/layout-client.hbs';
    //     res.render('client/dealers', {
    //         layout: renderHeader,
    //         dealerData: dealerHeader, //in header
    //         dealers: dealers,
    //         page: page,
    //         title: page.title,
    //         first_name: user ? user.first_name : null,
    //         last_name: user ? user.last_name : null,
    //     });
    // },

    aboutDealerPage: async (req, res) => {
        let renderPage;
        // let slag = `${req.params.slag}`;
        let page = await pagesService.getBlogPageBySlag(req.params.slag);
        if(!page) {
            renderPage = './404-V2';
        } else {
            if(page.banner) page.banner = JSON.parse(page.banner);
            if(page.body) page.body = JSON.parse(page.body);
            page.sections = JSON.parse(page.sections);
            renderPage = `client/${page.template}`;
        }
        const forms = await models.forms.findAll({where: {status: 1}, raw: true});
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
        res.render(renderPage, {
            metaData: req.body.metaData,
            layout: renderHeader,
            dealerData: dealerHeader, //in header
            page: page,
            forms: forms,
            title: page.title,
            first_name: user ? user.first_name : null,
            last_name: user ? user.last_name : null,
            cart: cart ? cart: null,
            currency: req.currency ? req.currency: null
        });
    },

    getPage: async (req, res) => {
            let slag = req.params.slag;
            let seo;
            let product = {};
            let homepage;
            if(slag) homepage = await pagesService.getPage({slag: slag, template: 'homepage'});
            if(!slag || homepage) {
                if(!homepage) slag = '/';
                // seo = await pagesService.getBlogPageBySlag('seo');
                // seo.sections = JSON.parse(seo.sections);
                let page = await pagesService.getBlogPageBySlag(slag);
                page.body = JSON.parse(page.body)
                if(page.body.seo_page) seo = page.body.seo_page;
                product.categories = [];
                product.new = [];
                product.propositions = [];
                product.recommended = [];
                if(page.body.categories) {
                    for(let id of page.body.categories) {
                        product.categories.push( (await models.product_kit_category.findByPk(id)).toJSON())
                    }
                }
                if(page.body.product) {
                    if(page.body.product.new && page.body.product.new.length) {
                        for(let id of page.body.product.new) {
                            let product_by_id  = (await models.product.findByPk(id,{include:{model: models.product_variations}})).toJSON()
                            if(req.currency.code == 0) {
                                product_by_id.price = (product_by_id.price*28).toFixed(2);
                                if(product_by_id.old_price) product_by_id.old_price = (product_by_id.old_price*28).toFixed(2);
                            }
                            product.new.push(product_by_id)
                        }
                    }
                    if(page.body.product.propositions && page.body.product.propositions.length) {
                        for(let id of page.body.product.propositions) {
                            let product_by_id  = (await models.product.findByPk(id,{include:{model: models.product_variations}})).toJSON()
                            if(req.currency.code == 0) {
                                product_by_id.price = (product_by_id.price*28).toFixed(2);
                                if(product_by_id.old_price) product_by_id.old_price = (product_by_id.old_price*28).toFixed(2);
                            }
                            product.propositions.push(product_by_id)
                        }
                    }
                    if(page.body.product.recommended && page.body.product.recommended.length) {
                        for(let id of page.body.product.recommended) {
                            let product_by_id  = (await models.product.findByPk(id,{include:{model: models.product_variations}})).toJSON()
                            if(req.currency.code == 0) {
                                product_by_id.price = (product_by_id.price*28).toFixed(2);
                                if(product_by_id.old_price) product_by_id.old_price = (product_by_id.old_price*28).toFixed(2);
                            }
                            product.recommended.push(product_by_id);
                        }
                    }
                }
                if(product.propositions && product.propositions.length) {
                    product.propositions.forEach(item => {
                        if(!item.slag) item.slag = item.id;
                        return item
                    })
                }
                if(product.recommended && product.recommended.length) {
                    product.recommended.forEach(item => {
                        if(!item.slag) item.slag = item.id;
                        return item
                    })
                }
                if(product.recommended && product.recommended.length) {
                    product.new.forEach(item => {
                        if(!item.slag) item.slag = item.id;
                        return item
                    })
                }
                if(product.categories && product.categories.length) {
                    product.categories.forEach(item => {
                        if(!item.slag) item.slag = item.id;
                        return item
                    })
                }
            }
            let renderPage;
            let dealers = [];
            let page = await pagesService.getBlogPageBySlag(slag);
            if(!page){
                renderPage = './404-V2';
            } else {
                if(page.sections) page.sections = JSON.parse(page.sections);
                if(page.body) page.body = JSON.parse(page.body);
                if(page.banner) page.banner = JSON.parse(page.banner);
                renderPage = `client/${page.template}`
                if(page.type === 'dealers-page') {
                    let dealerPages = await pagesService.getBlogPageAll({type: 'dealer', status: 1});
                    dealerPages.forEach(dealerPage => {
                        dealerPage.body = JSON.parse(dealerPage.body);
                        let dealer = {};
                        if(dealerPage.body) {
                            dealer.marker_title = dealerPage.body.marker_title;
                            dealer.email = dealerPage.body.email;
                            dealer.phone = dealerPage.body.phone;
                            dealer.marker_text = dealerPage.body.marker_text;
                            dealer.background_image = dealerPage.body.map_background_image;
                            dealer.map_image = dealerPage.body.map_image;
                            dealer.map_image_active = dealerPage.body.map_image_active;
                            dealer.link_page = dealerPage.slag;
                            dealer.lat = dealerPage.body.lat;
                            dealer.lng = dealerPage.body.lng;
                            dealers.push(dealer);
                        }
                    })
                }
            }
            const forms = await models.forms.findAll({where: {status: 1}, raw: true});
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
            res.render(renderPage, {
                metaData: req.body.metaData,
                layout: renderHeader,
                dealerData: dealerHeader, //in header
                dealers: dealers,
                page: page,
                seoPage: seo,
                product: product,
                forms: forms,
                title: page ? page.title: null,
                first_name: user ? user.first_name : null,
                last_name: user ? user.last_name : null,
                cart: cart ? cart: null,
                currency: req.currency ? req.currency: null
            });
        },
}
