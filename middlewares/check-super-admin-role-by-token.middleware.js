const jwt = require('jsonwebtoken');

const config = require('../configs/config');
const userService = require('../services/user.service');
const tokenUtil = require('../utils/token-util');

module.exports = async (req, res, next) => {
    //const token = req.get('Authorization');
    const token = req.cookies['jwt'];
    // try {
        if (token) {

            jwt.verify(token, config.JWT_SECRET_ADMIN, {}, (err) => {
                if (err) {
                    // let error = new Error(err.message);
                    // error.code = 403;
                    // throw error;
                    next();
                }
            });
            let user = await userService.getUser({ access_token: token })
            if(user){
                req.userType = user.type;
                req.userid = user.id;
                // res.setHeader('Authorization', token);
                next();
            }


        }
        next();


    // } catch (error) {
    //     next();
    // }
}
