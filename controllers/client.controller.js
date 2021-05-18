// const { models } = require('../sequelize-orm');
// const sequelize = require('../sequelize-orm');
const clientService = require('../services/client.service');
// const dealerService = require('../services/dealer.service');
const userService = require('../services/user.service');
const fs = require('fs');
const config = require('../configs/config');
const emailUtil = require('../utils/mail-util');
const templateUtil = require('../utils/template-util');
const moment = require('moment');

// const productService = require('../services/product.service');
const _ = require('lodash');
module.exports = {

    // getClientPersonalData: async (req, res) => {
    //     const id = req.user.userid;
    //     if (!id) throw new Error('No id');

    //     const user = await dealerService.getClientDetail(id);
    //     const dealer = await dealerService.getDealerUser(user.client.dealer_id);
    //     const dealersByRegion = await dealerService.getDealerByRegionId(user.region_activity_id);
    //     let activities = await dealerService.getAllActivity();
    //     let position_activity = await dealerService.getAllPositionActivity();
    //     let regions = await dealerService.getAllRegions();
    //     let unreadRejections = await clientService.getUnreadRejections(id);
     
        

    //     res.render('client/cabinet/index',{
    //         layout: 'client/layout-client-after-login.hbs',
    //         metaData: req.body.metaData,
    //         dealerData: dealer,
    //         activities: activities,
    //         position_activity: position_activity,
    //         regions: regions,
    //         unreadRejections: unreadRejections,
    //         dealersByRegion: dealersByRegion,
         
          
    //         ...user
    //     });
    // },

    // updateClientData: async (req, res) => {
    //     const id = req.user.userid;
    //     if (!id) throw new Error('No id');

    //     const userData = {
    //         city: req.body.city,
    //         index: req.body.index,
    //         mailing_address: req.body.mailing_address,
    //         house_number: req.body.house_number,
    //         apartment_number: req.body.apartment_number,
    //         updatedAt:Math.floor(new Date().getTime() / 1000)
    //     };
    //     const clientData = {
    //         company_url: req.body.company_url,
    //         company_name: req.body.company_name,
    //         activity_id: req.body.activity_id,
    //         position_activity_id: req.body.position_activity_id,
    //         updatedAt:Math.floor(new Date().getTime() / 1000)

    //     };

    //     const user = await dealerService.updateClientDetailEdit(id, userData, clientData);

    //     res.json(true);
    // },

    // changeDataRequest: async (req, res) => {
    //     const id = req.user.userid;
    //     if (!id) throw new Error('No id');

    //     const userData = {
    //         user_id: id ,
    //         first_name: req.body.first_name,
    //         last_name: req.body.last_name,
    //         phone: req.body.phone,
    //         email: req.body.email,
    //         region: req.body.region_activity_id,
    //         dealer: req.body.dealer,
    //         comment: req.body.comment,
    //     };

    //     const result = await clientService.changeDataRequest(userData);

    //     res.json(true);
    // },

    readRejectionMessage: async (req, res) => {
        const id = req.params.id;
        if (!id) throw new Error('No id');

        const result = await clientService.readRejectionMessage(id);

        res.json(true);
    },

    // getClientHistory: async (req, res) =>{
    //     const id = req.user.userid;
    //     if (!id) throw new Error('No id');

    //     let result = await dealerService.getClientHistory(id);
    //     result.history.forEach(booking => {
    //         booking.status = config.BOOKING_STATUSES[booking.status];
    //     });

    //     const client = await userService.getClient({user_id: id}, ['dealer_id']);
    //     const dealer = await dealerService.getDealerUser(client.dealer_id);
       
      
    //     res.render('client/cabinet/history', {
    //         layout: 'client/layout-client-after-login.hbs',
    //         metaData: req.body.metaData,
    //         history: result.history,
    //         ...result.user,
    //         dealerData: dealer,
           
           
    //     });
    // },

    // getClientHistoryDetail: async (req, res) =>{
    //     const id = req.user.userid;
    //     if (!id) throw new Error('No id');

    //     const booking_id = req.params.booking_id;
    //     if (!booking_id) throw new Error('No booking_id');

    //     let result = await dealerService.getBookingById(booking_id);

    //     result.statusText = config.BOOKING_STATUSES[result.status];
    //     result.address.pay_type = config.PAY_TYPES[result.address.pay_type];
    //     if(result.booking_attachments && result.booking_attachments.length){
    //         result.booking_attachments.map(i =>{
    //             let name = i.path.split('-');
    //             name.shift();
    //             i.path = name.join('');
    //         })
    //     }

    //     const client = await userService.getClient({user_id: id}, ['dealer_id']);
    //     const dealer = await dealerService.getDealerUser(client.dealer_id);
       
        
    //     const renderPage = result ? 'client/cabinet/detail' : './404-V2';
    //     res.render(renderPage, {
    //         layout: 'client/layout-client-after-login.hbs',
    //         metaData: req.body.metaData,
    //         dealerData: dealer,
    //         cart: cart ? cart: null,
        
    //         ...result
    //     });
    // },

    // getChangePassword: async (req, res) =>{
    //     const id = req.user.userid;
    //     if (!id) throw new Error('No id');

    //     const user = await dealerService.getClientDetail(id);
    //     const client = await userService.getClient({user_id: id}, ['dealer_id']);
    //     const dealer = await dealerService.getDealerUser(client.dealer_id);
      
      
    //     res.render('client/cabinet/password', {
    //         layout: 'client/layout-client-after-login.hbs',
    //         metaData: req.body.metaData,
    //         dealerData: dealer,
    //         cart: cart ? cart: null,
           
    //         ...user
    //     });
    // },

    // favorites: async (req, res) =>{
    //     const id = req.user.userid;
    //     if (!id) throw new Error('No id');
    //     const client = await userService.getClient({user_id: id}, ['dealer_id']);
    //     const user = await dealerService.getClientDetail(id);
    //     const dealer = await dealerService.getDealerUser(client.dealer_id);
      
    //     const perPage = 10;
      
    //     const page = 1;
    //      const countPages = Math.ceil(result.count / perPage);
    //      let category = []
    //     for(const i of result.rows)
    //     {
    //         if(i.product.category) category.push(...i.product.category)
    //         if(i.product.as_category_kit_product) category.push(...i.product.as_category_kit_product)
    //     }
    //     category = _(category).uniqBy(v => v.title).value();
     
    //     res.render('client/cabinet/favorites', {
    //         layout: 'client/layout-client-after-login.hbs',
    //         metaData: req.body.metaData,
    //         dealerData: dealer,
            
    //         favorite: favorite ? favorite: null,
    //         category_fav:category,
    //         pagination: {
    //             page: page,
    //             pageCount: countPages,
    //             count: result.count
    //         },
    //         result,
    //         ...user

    //     });

    // },
    // ajaxFavorites: async (req, res) =>{
    //     let page = req.body.page
    //     let title = req.body.title
    //     let perPage = 10;
    //     const offset = perPage * (page - 1);
    //     const id = req.user.userid;
    //     if (!id) throw new Error('No id');
    //     let product = await productService.ajaxFavorites({ title:title,user_id: id , offset:offset})
    //     let result = await templateUtil.getTemplate({...product}, 'client/cabinet/favorites-requests');
    //     let category = ''

    //     let countPages = Math.ceil(product.count / perPage);
    //     let  pagination = await templateUtil.getTemplate({pagination: {
    //             page: page,
    //             pageCount: countPages,
    //             pageLast: result.count
    //         } }, 'client/cabinet/pagination-requests');
    //     res.send({
    //         html: result,
    //         pagination: pagination,
    //         count:product.count
    //     });
    // } ,
    // addfavorites: async (req, res) =>{
    //     const id = req.user.userid;
    //     if (!id) throw new Error('No id');
    //     const user = await dealerService.getClientDetail(id);
    //     const body = req.body;
    //     let data = {
    //         product_id: body.product_id,
    //         type:body.type,
    //         user_id:id
    //     }
    //     let result = await productService.addfavorites(data)
    //     res.json(true);
    // },
    // deletefavorites: async (req, res) =>{
    //     const id = req.user.userid;
    //     if (!id) throw new Error('No id');
    //     const user = await dealerService.getClientDetail(id);
    //     const body = req.body;
    //     let data = {
    //         product_id: body.product_id,
    //         type:body.type,
    //         user_id:id
    //     }
    //        await productService.deletefavorites(data);
    //     res.json(200);
    // },

    // getCountFavorites: async  (req, res)  => {
    //     const id = req.user.userid;
    //     if (!id) throw new Error('No id');
    //      let result = await productService.getCountFavorites(id);
    //     res.json(result);
    // }


}
