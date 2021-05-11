const tokenUtil = require('../utils/token-util');
const bcryptUtil = require('../utils/bcrypt-util');
const jwt = require('jsonwebtoken');

const { models } = require('../sequelize-orm');
const userService = require('../services/user.service');
const config = require('../configs/config');


module.exports = {

    createAdmin: async (req, res) => {
        try {
<<<<<<< HEAD
            let { first_name, last_name, email, password, user_type } = req.body;
            const isEmailExist = await userService.getUser({ email });
             console.log(user_type);
              if (isEmailExist) {
=======
            let { first_name, last_name, email, password, type } = req.body;
            const isEmailExist = await userService.getUser({ email });
            if (isEmailExist) {
>>>>>>> commit to me!
              return   res.status(403).json({
                    message: 'Failed to create admin. Email already exists',
                    errCode: 403
                });
               
            }
<<<<<<< HEAD
          
=======
>>>>>>> commit to me!
            const hashedPassword = await bcryptUtil.hashPassword(password);
            const admin = await userService.createUser({
                email,
                password: hashedPassword,
<<<<<<< HEAD
                user_type,
=======
                type,
>>>>>>> commit to me!
                first_name,
                last_name
            });
          return  res.status(200).json(admin);
            
        } catch (err) {
          return  res.status(400).json({
                message: error.message,
                errCode: 400
            });
            
        }
    },


    adminLogin: async (req, res) => {
        try {
            let { email, password } = req.body;
            const admin = await userService.getUser({ email });
            if (!admin) {
              return  res.status(400).json({
                    message: 'Failed to login. Wrong email address or password',
                    errCode: 400
                });
                
            }
            const isPasswordMatch = await bcryptUtil.comparePassword(password, admin.password);
            if (!isPasswordMatch) {
            return    res.status(400).json({
                    message: 'Failed to login. Wrong email address or password',
                    errCode: 400
                });
                
            }
            if (admin.type != config.SUPER_ADMIN_ROLE) {
              return   res.status(400).json({
                    message: 'Failed to login. Wrong user role',
                    errCode: 400
                });
               
            }
            const token = tokenUtil({ first_name: admin.first_name, last_name: admin.last_name });
            await admin.update({ access_token: token.access_token, refresh_token: token.refresh_token });
            res.setHeader('Authorization', token.access_token);
            /*res.cookie('jwt', token.access_token, { maxAge: 2592000000 , secure: false,
                httpOnly: true, sameSite: 'none'});*/
          return  res.status(200).json({
                access_token: token.access_token,
            });
            
        } catch (err) {
         return   res.status(400).json({
                message: error.message,
                errCode: 400
            });
            
        }
    },

    logout: async (req, res) => {
        try {
            const user = await userService.getUser(req.userid);
            if (!user) {
             return   res.status(401).json({
                    message: 'User not exists',
                    errCode: 401
                });
                
            }
            await user.update({ access_token: '', refresh_token: '',updatedAt:Math.floor(new Date().getTime() / 1000) });
           return res.status(200).json(true);
            
        } catch (err) {
          return  res.status(400).json({
                message: error.message,
                errCode: 400
            });
            
        }
    },

    refresh: async (req, res) => {
        const token = req.get('Authorization');
        try {
            const user = await userService.getUser({ access_token: token });
            if (!user) {
            return    res.status(401).json({
                    message: 'The access_token provided is invalid',
                    errCode: 4014
                });
                
            }
            if (user && user.refresh_token) {
                jwt.verify(user.refresh_token, config.JWT_REFRESH_SECRET_ADMIN, {}, async (err) => {
                    if (err) {
                      return  res.status(401).json({
                            message: 'Refresh token has expired',
                            errCode: 4015
                        });
                        
                    }
                    const newToken = tokenUtil({ first_name: user.first_name, last_name: user.last_name });
                    await user.update({
                        access_token: newToken.access_token,
                        refresh_token: newToken.refresh_token,
                        updatedAt:Math.floor(new Date().getTime() / 1000)
                    });
                    res.setHeader('Authorization', newToken.access_token);
                    return res.status(200).json({
                        access_token: newToken.access_token,
                    });
                })
            } else {
             return   res.status(401).json({
                    message: 'Error to refresh token',
                    errCode: 4016
                });
                
            }

        } catch (err) {
          return  res.status(400).json({
                message: `Error to refresh token: ${err.message} `,
                errCode: 4017
            });
            
        }
    },




}
