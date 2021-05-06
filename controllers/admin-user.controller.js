const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");

const userService = require('../services/user.service');

// const regionActivityService = require('../services/region-activity.service');
// const srManagerService = require('../services/sr-manager.service');
// const blumManagerService = require('../services/blum-manager.service');
const config = require('../configs/config');
const errors = require('../configs/errors');
const bcryptUtil = require('../utils/bcrypt-util');
const { makeLocalToken } = require('../utils/app-util');
const emailUtil = require('../utils/mail-util');
const { models } = require('../sequelize-orm');
// const bookingService = require('../services/booking.service');


module.exports = {

    test: async (res) => {
        try {

            return

        } catch (error) {
            console.log(error)
            return
        }

    },


    adminCreateUser: async (req, res) => {

        let { first_name, last_name, email, phone, type, password, confirm_password} = req.body;

        if (!first_name || !last_name || !email || !phone || !type || !password ||  !confirm_password) {
          return  res.status(errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code).json({
                message: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.message,
                errCode: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code,
            });
            
        }
        if (!config.REGEX_PASSWORD.test(password)) {
          return  res.status(errors.BAD_REQUEST_USER_PASSWORD_NOT_VALID.code).json({
                message: errors.BAD_REQUEST_USER_PASSWORD_NOT_VALID.message,
                errCode: errors.BAD_REQUEST_USER_PASSWORD_NOT_VALID.code,
            });
            
        }
        if (password != confirm_password) {
          return  res.status(errors.BAD_REQUEST_USER_CONFIRM_PASSWORD_NOT_MATCH.code).json({
                message: errors.BAD_REQUEST_USER_CONFIRM_PASSWORD_NOT_MATCH.message,
                errCode: errors.BAD_REQUEST_USER_CONFIRM_PASSWORD_NOT_MATCH.code,
            });
            
        }
        if (!config.REGEX_PHONE.test(phone) || phone.length != 19) {
         return   res.status(errors.BAD_REQUEST_USER_PHONE_NOT_VALID.code).json({
                message: errors.BAD_REQUEST_USER_PHONE_NOT_VALID.message,
                errCode: errors.BAD_REQUEST_USER_PHONE_NOT_VALID.code,
            });
            
        }
     
        if (!config.REGEX_EMAIL.test(email)) {
          return  res.status(errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.code).json({
                message: errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.message,
                errCode: errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.code,
            });
            
        }
        let isUserEmailExist = await userService.getUser({ email }, ['email']);
        if (isUserEmailExist) {
           return res.status(errors.BAD_REQUEST_USER_EMAIL_EXIST.code).json({
                message: errors.BAD_REQUEST_USER_EMAIL_EXIST.message,
                errCode: errors.BAD_REQUEST_USER_EMAIL_EXIST.code,
            });
            
        }
        let isUserPhoneExist = await userService.getUser({ phone }, ['phone']);
        if (isUserPhoneExist) {
          return  res.status(errors.BAD_REQUEST_USER_PHONE_EXIST.code).json({
                message: errors.BAD_REQUEST_USER_PHONE_EXIST.message,
                errCode: errors.BAD_REQUEST_USER_PHONE_EXIST.code,
            });
            
        }
     
        const transaction = await sequelize.transaction();
        try {
            let newUser = {
                first_name, last_name, email, phone, type,
                password: await bcryptUtil.hashPassword(password),
               
              
              

            };
            let user = await userService.createUser(newUser, { transaction });

            if (type === config.CLIENT_ROLE) {
                let client = {
                   

                };
                client = await user.createClient(client, { transaction });
            }

       

     

          

            let localToken = makeLocalToken();
            await user.update({
                confirm_token: localToken.confirmToken,
                confirm_token_type: 'register',
                confirm_token_expires: localToken.confirmTokenExpires,
               
            }, { transaction })
            let mailObj = {
                to: email,
                subject: 'Підтвердження електронної адреси',
                data: {
                    password: password,
                    userName: email,
                    token: localToken.confirmToken
                }
            };
            await emailUtil.sendMail(mailObj, 'verify');

            await transaction.commit();

            return res.status(200).json(await userService.getUserDetails(user.id,['id', 'first_name', 'last_name', "email", "phone", 'user_type',   ,
                   ]))

        } catch (error) {
            await transaction.rollback();
         return   res.status(400).json({
                message: error.message,
                errCode: 4001
            });
            
        }


    },



    getAllUsers: async (req, res) => {

        let page = req.body.current_page ? parseInt(req.body.current_page) : 1;
        let perPage = req.body.items_per_page ? parseInt(req.body.items_per_page) : 10;

        try {
            let statusCount = await userService.adminCountsAllStatus(req.body.status);
            // let numberOfWaitionUser = await userService.adminCountsStatus(config.GLOBAL_STATUSES.WAITING);
            // let numberOfActiveUser = await userService.adminCountsStatus(config.GLOBAL_STATUSES.ACTIVE);
            // let numberOfBlockedUser = await userService.adminCountsStatus(config.GLOBAL_STATUSES.BLOCKED);
            // let numberOfDeletedUser = await userService.adminCountsStatus(config.GLOBAL_STATUSES.DELETED);
            // let numberOfAllUser = await userService.adminCountsAllStatus();
            // let statusCount = {
            //     all: numberOfAllUser,
            //     0: numberOfDeletedUser,
            //     1: numberOfActiveUser,
            //     2: numberOfBlockedUser,
            //     3: numberOfWaitionUser,
            // };

            if (req.body && req.body.status && req.body.status === 'all') {
                let filter = await userService.makeUserFilter(req.body, {
                        status: {
                            [Op.ne]: 0
                        }
                    }
                );
                let result = await userService.adminGetAllUsers(filter, page, perPage,
                    ['id', 'first_name', 'last_name', 'status', 'createdAt', 'type']
                );

                // result = result.data;
                result.statusCount = statusCount;
                return res.status(200).json(result);
            }
            let filter = await userService.makeUserFilter(req.body);
            let result = await userService.adminGetAllUsers(filter, page, perPage,
                ['id', 'first_name', 'last_name', 'status', 'createdAt', 'type']
            );

                // JSON.parse(JSON.stringify(result));
            // result = result.data;
            result.statusCount = statusCount;
            return res.status(200).json(result);

        } catch (error) {
          return  res.status(400).json({
                message: error.message,
                errCode: 400
            });
            
        }
    },

    getUserById: async (req, res) => {

        try {
            const id = req.params.id;
            let user = await userService.getUserDetails(id,
                ['id', 'first_name', 'last_name', "email", "phone", 'status', 'type', 'index', 'mailing_address', 'house_number', 'apartment_number',
                    'createdAt', "updatedAt", 'region_activity_id', 'city']
            );

            // result = JSON.parse(JSON.stringify(user));
            return res.status(200).json(user);

        } catch (error) {
          return  res.status(400).json({
                message: error.message,
                errCode: 4001
            });
            
        }
    },

    adminUpdateUserById: async (req, res) => {
        let id = req.params.id;

        let { first_name, last_name, email, type, index, house_number, apartment_number,
            region_activity_id, mailing_address, company_name, company_url, position_activity_id, activity_id, dealer_id, manager_sr_id,
            phone, crm_number, fixed_regions, fixed_dealers, city, phone_numbers, status } = req.body;
        const transaction = await sequelize.transaction();
        try {
            if (!first_name || !last_name || !email || !phone || !type || !id) {
            return    res.status(errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code).json({
                    message: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.message,
                    errCode: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code,
                });
                
            }
            if (email) {
                if (!config.REGEX_EMAIL.test(email)) {
                 return   res.status(errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.code).json({
                        message: errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.message,
                        errCode: errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.code,
                    });
                    
                }
                let isEmailExist = await userService.getUser({ email }, false);
                if (isEmailExist && isEmailExist.id != id) {
                  return  res.status(errors.BAD_REQUEST_USER_EMAIL_EXIST.code).json({
                        message: errors.BAD_REQUEST_USER_EMAIL_EXIST.message,
                        errCode: errors.BAD_REQUEST_USER_EMAIL_EXIST.code,
                    });
                    
                }
            }
            if(phone) {
                if (!config.REGEX_PHONE.test(phone) || phone.length != 19) {
                 return   res.status(errors.BAD_REQUEST_USER_PHONE_NOT_VALID.code).json({
                        message: errors.BAD_REQUEST_USER_PHONE_NOT_VALID.message,
                        errCode: errors.BAD_REQUEST_USER_PHONE_NOT_VALID.code,
                    });
                    
                }
                let isUserPhoneExist = await userService.getUser({ phone }, false);
                if (isUserPhoneExist && isUserPhoneExist.id != id) {
                 return   res.status(errors.BAD_REQUEST_USER_PHONE_EXIST.code).json({
                        message: errors.BAD_REQUEST_USER_PHONE_EXIST.message,
                        errCode: errors.BAD_REQUEST_USER_PHONE_EXIST.code,
                    });
                    
                }
            }
            if(phone_numbers && phone_numbers.length) {
                for (let phone of phone_numbers) {
                    if (!config.REGEX_PHONE.test(phone.phone) || phone.phone.length != 19) {
                     return   res.status(errors.BAD_REQUEST_USER_PHONE_NOT_VALID.code).json({
                            message: errors.BAD_REQUEST_USER_PHONE_NOT_VALID.message,
                            errCode: errors.BAD_REQUEST_USER_PHONE_NOT_VALID.code,
                        });
                        
                    }
                }
            }
            if(crm_number) {
                let isCrmNumberExist = await userService.getClient({ crm_number }, false);
                if (isCrmNumberExist && isCrmNumberExist.user_id != id) {
                  return  res.status(errors.BAD_REQUEST_CLIENT_CRM_NUMBER_EXIST.code).json({
                        message: errors.BAD_REQUEST_CLIENT_CRM_NUMBER_EXIST.message,
                        errCode: errors.BAD_REQUEST_CLIENT_CRM_NUMBER_EXIST.code,
                    });
                    
                }
            }
            let user = await userService.getUserDetails(id, [
                'id', 'first_name', 'last_name', "email", "phone", 'status', 'type', 'index', 'mailing_address', 'house_number', 'apartment_number',
                'createdAt', "updatedAt", 'region_activity_id', 'email_verified', 'city'
            ]);
            if (!user) {
             return   res.status(errors.BAD_REQUEST_ID_NOT_FOUND.code).json({
                    message: errors.BAD_REQUEST_ID_NOT_FOUND.message,
                    errCode: errors.BAD_REQUEST_ID_NOT_FOUND.code,
                });
                
            }
            let userObj;
          //  const updatedAt=Math.floor(new Date().getTime() / 1000);


            
            if (user.type == type) {
                if (user.type == config.SUPER_ADMIN_ROLE) {

                    userObj = { first_name, last_name, email, phone, city,status, updatedAt:Math.floor(new Date().getTime() / 1000) };

                    await user.update(userObj, { transaction });
                    await transaction.commit();
                    return res.status(200).json(await userService.getUserDetails(id, ['id', 'first_name', 'last_name', "email", "phone", 'status', 'type', 'index', 'mailing_address', 'house_number', 'apartment_number', 'createdAt', "updatedAt", 'region_activity_id', 'email_verified', 'city']))
                }
              
           
             
                if (user.type == config.CLIENT_ROLE) {
                    userObj = { city, first_name, last_name, email, phone, region_activity_id, mailing_address, house_number, apartment_number, index , status, updatedAt:Math.floor(new Date().getTime() / 1000)};
                    let clientManagerDetails = { company_name, company_url, activity_id, dealer_id, crm_number, position_activity_id,updatedAt:Math.floor(new Date().getTime() / 1000) };
                    user = await user.update(userObj, { transaction });
                    let client = await user.client.update(clientManagerDetails, { transaction });
                    await transaction.commit();
                    return res.status(200).json(await userService.getUserDetails(id, ['id', 'first_name', 'last_name', "email", "phone", 'status', 'type', 'index', 'mailing_address', 'house_number', 'apartment_number', 'createdAt', "updatedAt", 'region_activity_id', 'email_verified', 'city']))}
            } else {
                if (user.type == config.SUPER_ADMIN_ROLE) {
                    userObj = { status,city, first_name, last_name, email, type, phone, region_activity_id, mailing_address, house_number, apartment_number, index,updatedAt:Math.floor(new Date().getTime() / 1000) };
                    user = await user.update(userObj, { transaction });
                    if (type == config.CLIENT_ROLE) {
                        user = await user.createClient({ company_name, company_url, activity_id, dealer_id, crm_number, position_activity_id}, { transaction });
                    }
                    
                   
                  
                    await transaction.commit();
                    return res.status(200).json(await userService.getUserDetails(id, ['id', 'first_name', 'last_name', "email", "phone", 'status', 'type', 'index', 'mailing_address', 'house_number', 'apartment_number', 'createdAt', "updatedAt", 'region_activity_id', 'email_verified', 'city']))
                }
                if (user.type == config.CLIENT_ROLE) {
                    userObj = { city, first_name, last_name, email, phone, type, region_activity_id, mailing_address, house_number, apartment_number, index,updatedAt:Math.floor(new Date().getTime() / 1000) };
                    user = await user.update(userObj, { transaction });
                    await userService.deleteClient({ user_id: id });
            
                   
                    await transaction.commit();
                    return res.status(200).json(await userService.getUserDetails(id, ['id', 'first_name', 'last_name', "email", "phone", 'status', 'type', 'index', 'mailing_address', 'house_number', 'apartment_number', 'createdAt', "updatedAt", 'region_activity_id', 'email_verified', 'city']))
                }
           
            
           

            }
            return res.status(200).json(await userService.getUserDetails(id, ['id', 'first_name', 'last_name', "email", "phone", 'status', 'type', 'index', 'mailing_address', 'house_number', 'apartment_number', 'createdAt', "updatedAt", 'region_activity_id', 'email_verified', 'city']))

        } catch (error) {
            await transaction.rollback();
          return  res.status(400).json({
                message: error.message,
                errCode: '400'
            });
            
        }
    },

    

    changeUserStatusById: async (req, res) => {

        const { id, status } = req.body;
        try {
            let user = await userService.getUser(id,
                ['id', 'first_name', 'last_name', "email", "phone", 'status', 'type', 'createdAt', "updatedAt"]);
            if (!user) {
              return  res.status(errors.BAD_REQUEST_ID_NOT_FOUND.code).json({
                    message: errors.BAD_REQUEST_ID_NOT_FOUND.message,
                    errCode: errors.BAD_REQUEST_ID_NOT_FOUND.code,
                });
                
            }
let updatedAt=Math.floor(new Date().getTime() / 1000);
            user = await user.update({ status,updatedAt });


            return res.status(200).json(user.dataValues);

        } catch (error) {
          return  res.status(400).json({
                message: error.message,
                errCode: '400'
            });
            
        }
    },

    // dealersOfRegion: async (req, res) => {
    //     const regionId = req.body.regionId ? req.body.regionId : '';
    //     try {
    //         let dealer = await dealerService.getDealerByRegionId(regionId);
    //         result = JSON.parse(JSON.stringify(dealer));
    //         return res.status(200).json(result);
    //
    //     } catch (error) {
    //         res.status(400).json({
    //             message: error.message,
    //             errCode: ''
    //         });
    //         return
    //     }
    // },

    passwordRecovery: async (req, res) => {

        let id = req.params.id;
        try {
            let user = await userService.getUser(id, false);
            if (!user) {
              return  res.status(errors.BAD_REQUEST_ID_NOT_FOUND.code).json({
                    message: errors.BAD_REQUEST_ID_NOT_FOUND.message,
                    errCode: errors.BAD_REQUEST_ID_NOT_FOUND.code,
                });
                
            }

            let localToken = makeLocalToken();
            await user.update({
                confirm_token: localToken.confirmToken,
                confirm_token_type: 'reset',
                confirm_token_expires: localToken.confirmTokenExpires,
                updatedAt:Math.floor(new Date().getTime() / 1000)
            });
            let mailObj = {
                to: user.email,
                subject: 'Password reset',
                data: {
                    userName: user.email,
                    token: localToken.confirmToken
                }
            };
            await emailUtil.sendMail(mailObj, 'reset-pass');

            return res.status(200).json(true);

        } catch (error) {
          return  res.status(400).json({
                message: error.message,
                errCode: '400'
            });
            
        }
    },

    // deleteUsers: async (req, res) => {
    //     let { ids } = req.body;
    //     const updatedAt= Math.floor(new Date().getTime() / 1000);
    //     const deletedAt= Math.floor(new Date().getTime() / 1000);
    //     const transaction = await sequelize.transaction();
    //     try {
    //         let result = [];
    //         if (ids && ids.length) {
    //             for (let id of ids) {
    //                 let user = await userService.getUserDetails(id, ['id', 'first_name', 'last_name', "email", "phone", 'status', 'type', 'index', 'mailing_address', 'house_number', 'apartment_number', 'createdAt', "updatedAt", 'region_activity_id', 'email_verified', 'city'])
    //                 if (!user) {
    //                   return  res.status(errors.BAD_REQUEST_ID_NOT_FOUND.code).json({
    //                         message: errors.BAD_REQUEST_ID_NOT_FOUND.message,
    //                         errCode: errors.BAD_REQUEST_ID_NOT_FOUND.code,
    //                     });
                        
    //                 }
    //                 if (user.type == config.CLIENT_ROLE && user.status == config.GLOBAL_STATUSES.DELETED) {
    //                     await models.client.destroy({deletedAt:deletedAt},{where: {user_id: id}, transaction});
    //                 }
                
                
                  
    //                 if (user.type == config.SUPER_ADMIN_ROLE && user.status == config.GLOBAL_STATUSES.DELETED) {
    //                    await bookingService.updateBookingHistoryById({user_id: null},{user_id: id},transaction);
    //                     // await models.booking_history.update({user_id: null},{where: {user_id: id}, transaction});
    //                 }
    //                 if (user.status != config.GLOBAL_STATUSES.DELETED) {
    //                     user = await user.update({ status: config.GLOBAL_STATUSES.DELETED ,deletedAt:deletedAt,updatedAt:updatedAt});

    //                    // user = JSON.parse(JSON.stringify(user));
    //                     result.push({user, basket: true});
    //                 } else {
    //                     await paymentService.editPayment({user_id: null},{user_id: id},transaction);
    //                     // Замінив методом вище
    //                     // await models.payment.update({user_id: null},{where: {user_id: id}, transaction});
    //                     await bookingService.editCart({user_id:null},{user_id:id},transaction);
    //                     // Замінив методом вище
    //                     // await models.cart.update({user_id: null},{where: {user_id: id}, transaction});
    //                     await bookingService.editBooking({user_id: null},{user_id: id},transaction);
    //                     //  Замінив метом вище 
    //                     // await models.booking.update({user_id: null},{where: {user_id: id}, transaction});
    //                     userService.deleteUserById({id:id},transaction);
    //                     // await models.user.destroy({where: {id: id}, transaction});
    //                     result.push({ id: id, deleted: true })
    //                 }

    //             }

    //         }
    //         await transaction.commit();
    //         return res.status(200).json(result);

    //     } catch (error) {
    //         await transaction.rollback();
    //       return  res.status(400).json({
    //             message: error.message,
    //             errCode: '400'
    //         });
            
    //     }
    // },

    // getAllRegions: async (req, res) => {
    //     try {
    //         let regions = await regionActivityService.getAllRegionActivity({status: 1});
    //         return res.status(200).json(regions);
    //     } catch (err) {
    //      return   res.status(400).json({
    //             message: err.message,
    //             errCode: '400'
    //         });
            
    //     }

    // },
    // getAllActivity: async (req, res) => {
    //     try {
    //         let activities = await dealerService.getAllActivity({});
    //         return res.status(200).json(activities);

    //     } catch (err) {
    //      return   res.status(400).json({
    //             message: err.message,
    //             errCode: '400'
    //         });
            
    //     }

    // },
    // getAllPositionActivity: async (req, res) => {
    //     try {
    //         let position_activities = await dealerService.getAllPositionActivity();
    //         return res.status(200).json(position_activities);

    //     } catch (err) {
    //       return  res.status(400).json({
    //             message: err.message,
    //             errCode: '400'
    //         });
            
    //     }

    // },
   
    // getSrManagersByRegion: async (req, res) =>{
    //     let region = req.body.region;
    //     if(!region) region = [];
    //     regionFilter = region ? {where: {id: region}, required: true} : {};
    //     let srManagers =     await models.manager_sr.findAll({
    //         include:[
    //             {model: models.user, attributes: ['first_name', 'last_name']},
    //             {model: models.region_activity, through:{attributes:[]}, ...regionFilter },
    //             {model: models.region_activity, through:{attributes:[]}, as: 'allRegions' },
    //         ],
    //     });
    //     res.status(200).json(srManagers);
    // },
    checkCRMNumber: async (req, res) =>{
        let {number, id} = req.body;
        let result =await models.client.findAll({where: {crm_number: number}});
       
        if(id) {
            if (result && result.length && result.length === 1 && result[0].user_id == id) {
                return res.status(200).json({ isExist: false });
            } else if (result && result.length === 0) {
                return res.status(200).json({ isExist: false });
            }
            return res.status(200).json({ isExist: true });
        } else {
            if(result && result.length) {
                return res.status(200).json({isExist: true})
            } else {
                return res.status(200).json({isExist: false})
            }
        }
    },
    // checkIsEmailExist: async (req, res) => {
    //     let { id, email } = req.body;
    //     try {
    //         let result = await userService.findUsersByFilter({ email });
    //         if (result && result.length && result.length === 1 && result[0].id == id) {
    //             return res.status(200).json({ emailExist: false });
    //         } else if (result && result.length === 0) {
    //             return res.status(200).json({ emailExist: false });
    //         }
    //         return res.status(200).json({ emailExist: true });
    //
    //     } catch (error) {
    //         res.status(400).json({
    //             message: error.message,
    //             errCode: ''
    //         });
    //         return
    //     }
    // },
    checkIsDataExist: async (req, res) => {
        let { id, email, phone } = req.body;
        try {
            let result
            if(email) {
                result = await userService.findUsersByFilter({ email });
            } else if(phone) {
                result = await userService.findUsersByFilter({ phone });
            }
            if(id) {
                if (result && result.length && result.length === 1 && result[0].id == id) {
                    return res.status(200).json({ isExist: false });
                } else if (result && result.length === 0) {
                    return res.status(200).json({ isExist: false });
                }
                return res.status(200).json({ isExist: true });
            } else {
                if(result && result.length) {
                    return res.status(200).json({isExist: true})
                } else {
                    return res.status(200).json({isExist: false})
                }
            }

        } catch (error) {
         return   res.status(400).json({
                message: error.message,
                errCode: '400'
            });
            
        }
    },




}
