const { models } = require('../sequelize-orm');
const config = require('../configs/config');

module.exports = async (req, res, next) => {
    let token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    let currency = req.cookies['currencyType'];
    if(!currency) currency = 0;
    req.currency = {
        code: currency, decode: config.CURRENCY_TYPES[currency]
    }
    if (token) {
        const client = await models.users.findOne({where: {access_token: token, type: config.CLIENT_ROLE}, include: [
                {model: models.client, include: [{model: models.dealer}]}
            ]});
// JSON.parse(JSON.stringify(client));
            if(client) req.user = client.toJSON();
    }
    return next();
}
