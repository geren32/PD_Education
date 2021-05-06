const jwt = require('jsonwebtoken');

const config = require('../configs/config');
const userService = require('../services/user.service');
const tokenUtil = require('../utils/token-util');


module.exports = async (req, res, next) => {
    const token = req.get('Authorization');
    //const token = req.cookies['jwt'];

    if (!token) {
     return   res.status(401).json({
            message: 'The access token is not provided in the "Authorization" header',
            errCode: 4011
        });
        // next(err);
        
    }
    let user;
    try {
        jwt.verify(token, config.JWT_SECRET_ADMIN, {}, (err) => {
            if (err) {
                let error = new Error(err.message);
                error.code = 400;
                throw error;
            }
        });
        user = await userService.getUser({ access_token: token })
        if (!user) {
          return  res.status(401).json({
                message: 'The access_token provided is invalid',
                errCode: 4012
            });
            // next(err);
            
        }
        res.setHeader('Authorization', token);
        req.userType = user.type;
        req.userid = user.id;

        next();


    } catch (error) {
       return  res.status(401).json({
            message: 'The access_token provided is invalid',
            errCode: 4013
        });
       
    }




    /*try {
        jwt.verify(token, config.JWT_SECRET_ADMIN, {}, (err) => {
            if (err) {
                let error = new Error(err.message);
                error.code = 400;
                throw error;
            }
        });
        user = await userService.getUser({ access_token: token });
        if (!user) {
            res.status(401).json({
                message: 'No user find with this token',
                errCode: 401
            });
            // next(err);
            return;
        }
        //res.setHeader('Authorization', token);
        req.userType = user.type;
        req.userid = user.id;

        next();


    } catch (error) {
        console.log(error);

        user = await userService.getUser({ access_token: token });
        if (!user) {
            res.status(401).json({
                message: 'No user find with this token',
                errCode: 401
            });
            // next(err);
            return;
        }
        if (user && user.refresh_token) {
            jwt.verify(user.refresh_token, config.JWT_REFRESH_SECRET_ADMIN, {}, async (err) => {
                if (err) {
                    res.status(401).json({
                        message: 'Refresh token has expired',
                        errCode: 401
                    });
                    return;
                }
                const newToken = tokenUtil({first_name: user.first_name, last_name: user.last_name});
                await user.update({ access_token: newToken.access_token, refresh_token: newToken.refresh_token });
                //res.setHeader('Authorization', newToken.access_token);
                res.cookie('jwt', newToken.access_token, { maxAge: 2592000000 });
                req.userType = user.type;
                req.userid = user.id;

                next();

            })
        }
    }*/





}
