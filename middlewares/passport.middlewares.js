const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../configs/config');
const userService = require('../services/user.service');
const tokenUtil = require('../utils/token-util');
const { getDataFromUserToReq } = require('../utils/extra-util');
const { models } = require('../sequelize-orm');

module.exports = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {

        // If authentication failed, `user` will be set to false. If an exception occurred, `err` will be set.
        if (err || !user) {
            // PASS THE ERROR OBJECT TO THE NEXT ROUTE i.e THE APP'S COMMON ERROR HANDLING MIDDLEWARE
            //return next(info);
            let token = req.cookies['jwt'];
            if (!token) {
                res.redirect('/auth/login');
            }
            let user = await models.user.findOne({where: { access_token: token }, include: [
                    {model: models.client/*, include: [{model: models.dealer}]*/},
                    {model: models.dealer},
                    {model: models.manager_sr},
                    {model: models.manager_blum}
                ]});
            if (!user) {
                res.redirect('/auth/login');
            }
            if (user && user.refresh_token) {
                jwt.verify(user.refresh_token, config.JWT_REFRESH_SECRET_ADMIN, {}, async (err) => {
                    if (err) {
                        res.redirect('/auth/login');
                    }
                    const newToken = tokenUtil({first_name: user.first_name, last_name: user.last_name, userid: user.id});
                    await user.update({ access_token: newToken.access_token, refresh_token: newToken.refresh_token });
                    res.cookie('jwt', newToken.access_token, { maxAge: 2592000000 });
                    req.user = getDataFromUserToReq(user);
                    let currency = req.cookies['currencyType'];
                    if(!currency) currency = 0;
                    req.currency = {
                        code: currency, decode: config.CURRENCY_TYPES[currency]
                    }
                    next();

                })
            }

        } else {
            req.user = user;
            return next();
        }
    })(req, res, next);
}
