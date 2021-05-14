const express = require('express');
const router = express.Router();

/* GET home page. */

// const blogController = require('../controllers/blog.controller');


// const searchController = require('../controllers/search.controller');
// const checkSuperAdminRoleByToken = require('../middlewares/check-super-admin-role-by-token.middleware');
const clientController = require('../controllers/client.controller');

// const checkClientMiddleware = require('../middlewares/check-client-role.middleware');
// const passportMiddleware = require('../middlewares/passport.middlewares');


router
  
// .get('/', blogController.getPage)

//     // .get('/dealers', blogController.getDealers)

//     // .post('/searchItems', searchController.searchItems)
//     // .post('/search', searchController.searchItemsFull)
//     // .post('/searchItemsAjax', searchController.searchItemsAjax)
//     .get('/blog/:page?', blogController.getPostByCategory)
//     .post('/blog/category', blogController.getPostByCategoryAjax)
//     // .get('/blog/post/:id(*)', blogController.getPost)

//     // .get('/about-dealer/:slag(*)', blogController.aboutDealerPage)

//     .get('/getPost/:id(*)', blogController.getPost)
//     .get('/getPage/:slag(*)', blogController.getPage)

   

  

    // .get('/cabinet', passportMiddleware, checkClientMiddleware, clientController.getClientPersonalData)

    // .post('/cabinet/update-client-data', passportMiddleware, checkClientMiddleware, clientController.updateClientData)

    // .post('/cabinet/change-data-request', passportMiddleware, checkClientMiddleware, clientController.changeDataRequest)

    // .get('/cabinet/read-rejection-message/:id', passportMiddleware, checkClientMiddleware, clientController.readRejectionMessage)

    // .get('/cabinet/history-orders', passportMiddleware, checkClientMiddleware, clientController.getClientHistory)
    // .get('/cabinet/history-detail/:booking_id', passportMiddleware, checkClientMiddleware, clientController.getClientHistoryDetail)

    // .get('/cabinet/password', passportMiddleware, checkClientMiddleware, clientController.getChangePassword)

    // .get('/cabinet/favorites', passportMiddleware, checkClientMiddleware, clientController.favorites)
    // .post('/cabinet/favorites', passportMiddleware, checkClientMiddleware, clientController.ajaxFavorites)
    // .post('/cabinet/addfavorites', passportMiddleware, checkClientMiddleware, clientController.addfavorites)
    // .post('/cabinet/deletefavorites', passportMiddleware, checkClientMiddleware, clientController.deletefavorites)
    // .post('/cabinet/getCountFavorites', passportMiddleware, checkClientMiddleware, clientController.getCountFavorites)




module.exports = router;
