const sequelize = require('../sequelize-orm');

const bcryptUtil = require('../utils/bcrypt-util');
const tokenUtil = require('../utils/token-util');
const { models } = require('../sequelize-orm');
const config = require('../configs/config');
const userService = require('../services/user.service');



const { makeLocalToken } = require('../utils/app-util');
const emailUtil = require('../utils/mail-util');


module.exports = {

    registerPage: async (req, res) => {
        try {
          
            let activity = await userService.findAllAcivity();
            let positionActivity = await userService.findAllPositionAcivity();

            res.render('client/register', {
                metaData: req.body.metaData,
                //info: req.flash("info"),
                //passwordInfo: req.flash("passwordInfo"),
                // uniqueRegions: uniqueRegions,
                positionActivity: positionActivity,
                activity: activity
            });

        } catch (err) {
           return res.status(400).json({
                message: err.message,
                errCode: 400
            });
            
        }

    },

    registerNewClient: async (req, res) => {

        let { first_name, last_name, email, password, confirm_password, phone, index, 
  city } = req.body;

        if (!last_name) {
            return res.status(200).json({ lastNameNotExist: true });
        }
        if (!first_name) {
            return res.status(200).json({ firstNameNotExist: true });
        }
        if (!password) {
            return res.status(200).json({ passwordNotExist: true });
        }
        if (!config.REGEX_PASSWORD.test(password)) {
            return res.status(200).json({ badPassword: true });
        }
        if (password != confirm_password) {
            return res.status(200).json({ passwordNotConfirm: true });
        }
        if (!config.REGEX_PHONE.test(phone)) {
            return res.status(200).json({ phoneNumberNotExist: true });
        }
        if (!config.REGEX_EMAIL.test(email)) {
            return res.status(200).json({ notEmail: true });
        }
      
        if (!city) {
            return res.status(200).json({ cityNotExist: true });
        }
     
       
      
        const transaction = await sequelize.transaction();
        try {
            const userExist = await userService.getUser({ email: email }, ['id']);
            if (userExist) {
                return res.status(200).json({ emailExist: true });
            }
            const phoneExist = await userService.getUser({ phone: phone_number }, ['id']);
            if (phoneExist) {
                return res.status(200).json({ phoneExist: true });
            }

            let userObj = {
                first_name, last_name, email: email,
                password: await bcryptUtil.hashPassword(password),
              phone: phone
               

            };
          
            user = await userService.createUser(userObj, { transaction });
            // client = await user.createClient(client, { transaction });

            let localToken = makeLocalToken();
            await user.update({
                confirm_token: localToken.confirmToken,
                confirm_token_type: 'register',
                confirm_token_expires: localToken.confirmTokenExpires,
                updatedAt:Math.floor(new Date().getTime() / 1000)
            }, { transaction })
            let mailObj = {
                to: new_email,
                subject: 'Підтвердження електронної адреси',
                data: {
                    userName: new_email,
                    token: localToken.confirmToken
                }
            };
            await emailUtil.sendMail(mailObj, 'verify');

            // req.flash('error', 'Вам надіслано емайл. Очікуйте підтвердження реєстрації');
            // res.redirect('login');

            await transaction.commit();

          return  res.status(200).json({ successRegistration: true });
            
        } catch (err) {
          
            await transaction.rollback();
            return  res.status(400).json({
                message: err.message,
                errCode: 400
            });
        }

    },

    registerConfirm: async (req, res) => {
        let token = req.params.token;

        try {
            const user = await userService.getUser({ confirm_token: token });

            if (user && user['confirm_token_type'] === 'register') {
                const expiresAt = (new Date(user.confirm_token_expires)).getTime();
                if (expiresAt < Date.now()) {
                    let error = 'Email not verified. The token has expired';
                  return  res.redirect('/auth/login/'+error);
                    
                } else {
                    await user.update({
                        confirm_token: null,
                        confirm_token_type: null,
                        confirm_token_expires: null,
                        email_verified: true,
                        updatedAt:Math.floor(new Date().getTime() / 1000)
                    });
                    if(user.status == config.GLOBAL_STATUSES.WAITING){
                        let error = 'Email confirmed. Awaiting confirmation of registration';
                        return res.redirect('/auth/login/'+error);
                       
                    }
                    if(user.status == config.GLOBAL_STATUSES.ACTIVE){
                        let error = 'Congratulations, email confirmed. Please login ';
                        return res.redirect('/auth/login/'+error);
                       
                    }

                    let error = "Contact the administrator";
                   return res.redirect('/auth/login/'+error);
                    
                }
            } else {
                let error = 'Email not confirmed. Not the correct token';
              return  res.redirect('/auth/login/'+error);
                
            }
        } catch (err) {
         return   res.status(400).json({
                message: err.message,
                errCode: 400
            });
            
        }
    },

    loginPage: (req, res) => {
        res.render('client/index', {
            metaData: req.body.metaData,
            layout: 'client/layout-client.hbs',
            login: true,
            user: req.user,
            error: req.params.error
        });
    },

  

    userLogin: async (req, res) => {
        try {
            let { email, password } = req.body;
            const user = await userService.getUser({ email });

            if (!user) {
                res.render('client/index', {
                    metaData: req.body.metaData,
                    layout: 'client/layout-client',
                    login: true,
                    error: 'Incorrect password or email'
                });
                
            }
          
            if (!user.email_verified) {
                res.render('client/index', {
                    metaData: req.body.metaData,
                    layout: 'client/layout-client',
                    login: true,
                    error: 'Email not verified. You need to confirm your email address'
                });
                
            }
            if (user.status != config.GLOBAL_STATUSES.ACTIVE) {
                if (user.status == config.GLOBAL_STATUSES.BLOCKED) {
                    res.render('client/index', {
                        metaData: req.body.metaData,
                        layout: 'client/layout-client',
                        login: true,
                        error: "Your account is locked. Please contact the administrator"
                    });
                    
                }else if (user.status == config.GLOBAL_STATUSES.WAITING){
                    res.render('client/index', {
                        metaData: req.body.metaData,
                        layout: 'client/layout-client',
                        login: true,
                        error: 'Awaiting confirmation of registration by the administrator'
                    });
                    
                }else if (user.status == config.GLOBAL_STATUSES.DELETED){
                    res.render('client/index', {
                        metaData: req.body.metaData,
                        layout: 'client/layout-client',
                        login: true,
                        error: "Your account has been deleted. Please contact the administrator"
                    });
                    
                }
            }
            const isComparePassword = await bcryptUtil.comparePassword(password, user.password);
            if (!isComparePassword){
                res.render('client/index', {
                    metaData: req.body.metaData,
                    layout: 'client/layout-client',
                    login: true,
                    error: 'Incorrect password or email'
                });
               
            }

            const token = tokenUtil({ first_name: user.first_name, last_name: user.last_name, userid: user.id });
            await user.update({ access_token: token.access_token, refresh_token: token.refresh_token, updatedAt:Math.floor(new Date().getTime() / 1000) });
            res.cookie('jwt', token.access_token, { maxAge: 2592000000 });

            if (user.type === config.CLIENT_ROLE) {
                let url = req.headers.referer.split(req.headers.host).pop();
               return  res.redirect(url ? url !== '/auth/login' ? url : '/' : '/');
               
            } 
          
            //     else if (user.type === config.SR_MANAGER_ROLE) {
            //    return res.redirect('/sr-manager/sr-manager-orders');
            //     } 
            //     else if (user.type === config.BLUM_MANAGER_ROLE) {
            //    return  res.redirect('/blum-manager/blum-manager-orders'); }
               
            else if (user.type === config.SUPER_ADMIN_ROLE) {
               return  res.redirect('/api/auth/admin/login');
               
            }

            return;
        } catch (err) {
           return  res.status(400).json({
                message: err.message,
                errCode: 400
            });
           
        }
    },

    forgotPasswordPage: async (req, res) => {
        let token = req.params.token;
        try {
            const user = await userService.getUser({ confirm_token: token });

            if (user && user['confirm_token_type'] === 'reset') {
                const expiresAt = (new Date(user.confirm_token_expires)).getTime();
                if (expiresAt < Date.now()) {
                    res.render('client/index', {
                        metaData: req.body.metaData,
                        layout: 'client/layout-client',
                        resetPassword: true,
                        user: req.user,
                        error: 'The token has expired'
                    });
                   
                } else {

                    res.render('client/index', {
                        metaData: req.body.metaData,
                        layout: 'client/layout-client',
                        resetPassword: true,
                        token: token,
                        user: req.user,
                        //error: ''
                    });
                    
                }
            } else {
                res.render('client/index', {
                    metaData: req.body.metaData,
                    layout: 'client/layout-client',
                    resetPassword: true,
                    user: req.user,
                    error: 'The token is incorrect'
                });
               
            }
        } catch (err) {
         return   res.status(400).json({
                message: err.message,
                errCode: 400
            });
            
        }
    },

    resetPassword: async (req, res) => {
        let { token, password, сonfirmPassword } = req.body;
        if (!password) {
            res.render('client/index', {
                metaData: req.body.metaData,
                layout: 'client/layout-client',
                resetPassword: true,
                token: token,
                user: req.user,
                error: "No password specified"
            });
            
        }
        if (password != сonfirmPassword) {
            res.render('client/index', {
                metaData: req.body.metaData,
                layout: 'client/layout-client',
                resetPassword: true,
                token: token,
                user: req.user,
                error: "The password does not match"
            });
            
        }
        if (!config.REGEX_PASSWORD.test(password)) {
            res.render('client/index', {
                metaData: req.body.metaData,
                layout: 'client/layout-client',
                resetPassword: true,
                token: token,
                user: req.user,
                error: "The password does not meet the requirements"
            });
           
        }
        try {
            const user = await userService.getUser({ confirm_token: token });

            if (user && user['confirm_token_type'] === 'reset') {
                const expiresAt = (new Date(user.confirm_token_expires)).getTime();
                if (expiresAt < Date.now()) {
                    res.render('client/index', {
                        metaData: req.body.metaData,
                        layout: 'client/layout-client',
                        resetPassword: true,
                        user: req.user,
                        error: 'The token has expired'
                    });
                   
                } else {

                    const newHashPassword = await bcryptUtil.hashPassword(password);
                    await user.update({
                        password: newHashPassword,
                        confirm_token: null,
                        confirm_token_type: null,
                        confirm_token_expires: null,
                        updatedAt:Math.floor(new Date().getTime() / 1000)
                     });

                     res.render('client/index', {
                         metaData: req.body.metaData,
                         layout: 'client/layout-client',
                         login: true,
                         user: req.user,
                         error: 'Password changed'
                     });
                    
                }
            } else {
                res.render('client/index', {
                    metaData: req.body.metaData,
                    layout: 'client/layout-client',
                    resetPassword: true,
                    user: req.user,
                    error: 'The token is incorrect'
                });
                
            }
        } catch (err) {
          return  res.status(400).json({
                message: err.message,
                errCode: 400
            });
            
        }
    },

    forgotPassword: async (req, res) => {
        let { email } = req.body;

        if (!email) {
            res.render('client/index', {
                metaData: req.body.metaData,
                layout: 'client/layout-client',
                forgotPassword: true,
                user: req.user,
                info: 'Email not specified'
            });
            
        }
        if (!config.REGEX_EMAIL.test(email)) {
            res.render('client/index', {
                metaData: req.body.metaData,
                layout: 'client/layout-client',
                forgotPassword: true,
                user: req.user,
                info: 'Not the right email'
            });
            
        }
        try {
            const user = await userService.getUser({ email });
            if (!user) {
                res.render('client/index', {
                    metaData: req.body.metaData,
                    layout: 'client/layout-client',
                    forgotPassword: true,
                    user: req.user,
                    info: 'Email address not found'
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
                to: email,
                subject: 'Password reset',
                data: {
                    userName: email,
                    token: localToken.confirmToken
                }
            };
            await emailUtil.sendMail(mailObj, 'reset-pass');
            res.render('client/index', {
                metaData: req.body.metaData,
                layout: 'client/layout-client',
                forgotPassword: true,
                user: req.user,
                info: ' Password reset email has been sent'
            });
            

        }
        catch (err) {
         return   res.status(400).json({
                message: err.message,
                errCode: 400
            });
            
        }

    },

    changePasswordUPDATE: async (req, res) => {
        const userId = req.user.userid;
        let { password, newPassword, confirmNewPassword } = req.body;
        let info = null;

        if (!password || !confirmNewPassword) {
          return  res.json( {result: "No password or re-password specified" });
            
        }
        if (!config.REGEX_PASSWORD.test(password)) {
           return res.json( {result: "The password does not meet the requirements" });
            
        }
        if (newPassword != confirmNewPassword) {
           return res.json( {result: "Password does not match password" });
            
        }
        try {
            const user = await userService.getUser(userId, ['id', 'email', 'password', 'type']);
            const isComparePassword = await bcryptUtil.comparePassword(password, user.password);
            if (!isComparePassword) {
              return  res.json( {result: "Invalid current password" });
                
            }

            const newHashPassword = await bcryptUtil.hashPassword(newPassword);
            await user.update({ password: newHashPassword ,updatedAt:Math.floor(new Date().getTime() / 1000)});

            res.json({ result: "Password changed!" });
        }
        catch (err) {
           return res.status(400).json({
                message: err.message,
                errCode: 400
            });
            
        }
    },

    getAllRegion: async (req, res) => {
        try {

            let citysOfRegion = await regionActivityService.getAllRegionActivity();
            return res.json(citysOfRegion);

        } catch (err) {
           return res.status(400).json({
                message: err.message,
                errCode: 400
            });
            
        }

    },

    // dealersOfRegion: async (req, res) => {
    //     try {
    //         const regionId = req.body.regionId ? req.body.regionId : '';
    //         let dealersOfRegion = await dealerService.getDealerByRegionId(regionId);
    //         res.json(dealersOfRegion);

    //     } catch (err) {
    //       return  res.status(400).json({
    //             message: err.message,
    //             errCode: 400
    //         });
            
    //     }

    // },

    /*logout: (req, res, next) => {
        req.logout();
        req.session.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('login');
        });
    },*/

    logout: async (req, res) => {
        const token = req.cookies['jwt'];
        res.cookie('jwt', '', {maxAge: 0});
        try {
            const user = await userService.getUser({ access_token: token });
            if (!user) {
              return   res.status(403).json({
                    message: 'User not exists',
                    errCode: 403
                });
               
            }
            await user.update({ access_token: null, refresh_token: null ,updatedAt:Math.floor(new Date().getTime() / 1000)});
            return res.redirect('login');
           
        } catch (err) {
          return  res.status(400).json({
                message: err.message,
                errCode: 400
            });
            
        }
    },

    checkIsEmailExist: async (req, res) => {
        let newEmail  = req.params.newEmail;
        if (!config.REGEX_EMAIL.test(newEmail)) {
            return res.status(200).json({ notEmail: true });
        }
        try {
            let result = await userService.getUser({ email: newEmail }, false);
            if (result) {
                return res.status(200).json({ emailExist: true });
            }
            return res.status(200).json({ emailExist: false });

        } catch (error) {
          return  res.status(400).json({
                message: error.message,
                errCode: 400
            });
            
        }

    },

    checkIsPhoneExist: async (req, res) => {
        let phone  = req.params.phone;


        if (!config.REGEX_PHONE.test(phone)) {
            return res.status(200).json({ notPhone: true });
        }
        try {
            let result = await userService.getUser({ phone: phone }, false);
            if (result) {
                return res.status(200).json({ phoneExist: true });
            }
            return res.status(200).json({ phoneExist: false });

        } catch (error) {
           return  res.status(400).json({
                message: error.message,
                errCode: 400
            });
           
        }

    },



}
