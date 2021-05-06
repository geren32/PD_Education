const config = require('../configs/config');

module.exports = async (req, res, next) => {
    if (req.user.userType && (req.user.userType === config.CLIENT_ROLE || req.user.userType === config.SUPER_ADMIN_ROLE)) {
        return next();
    }
    // res.redirect('login');
   return res.render('404');
    
}
