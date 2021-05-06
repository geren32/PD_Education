const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const Sequelize = require('sequelize');
const moment = require('moment');
const config = require('../configs/config');
const { Op } = Sequelize;
const dealerService = require('../services/dealer.service');

module.exports = {

    changeDataRequest: async (userData) => {

        const user = await dealerService.getClientDetail(userData.user_id);
        const dealer = await dealerService.getDealerUser(user.client.dealer_id);

        let changeRequest = {
            user_id: user.id,
            first_name_before: user.first_name,
            first_name_after: userData.first_name && userData.first_name !== user.first_name ? userData.first_name : null,
            last_name_before: user.last_name,
            last_name_after: userData.last_name && userData.last_name !== user.last_name ? userData.last_name : null,
            phone_before: user.phone,
            phone_after: userData.phone && userData.phone !== user.phone ? userData.phone : null,
            email_before: user.email,
            email_after: userData.email && userData.email !== user.email ? userData.email : null,
            region_before: user.region_activity_id,
            region_after: userData.region && userData.region !== user.region_activity_id ? userData.region : null,

            dealer_before: user.client.dealer_id,
            dealer_after: userData.dealer && userData.dealer !== user.client.dealer_id ? userData.dealer : null,

            comment: userData.comment,
            client_company_before: user.client.company_name,
            status: 0
           

        };
       // console.log(createdAt);

        let request = await models.change_data_request.create(changeRequest);

        return request;
    },

    getUnreadRejections: async (user_id) => {
        const unreadRejections = await models.change_data_request.findAll({
            where: {
                [Op.and]:[
                    { user_id: user_id },
                    {[Op.or]:[{ is_read_rejection: {[Op.not]: 1} }, {is_read_rejection:{[Op.is]: null } }]},
                    {status: 2}
                ] },
            attributes:['reason_for_rejection', 'id']
        });
// JSON.parse(JSON.stringify(unreadRejections));
        return unreadRejections.map(function(item) {
            return item.toJSON();
        })
    },

    readRejectionMessage: async (id) => {
        const read = await models.change_data_request.update({is_read_rejection: true,updatedAt:Math.floor(new Date().getTime() / 1000)}, {where: { id: id }});
        return read;
    }


}
