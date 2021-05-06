const config = require('../configs/config');

module.exports = async (req, res, next) => {

    if (req.userType && req.userType === config.SUPER_ADMIN_ROLE) {
        return next();
    }
    // res.redirect('login');
 return   res.status(401).json({
        message: 'Wrong super admin role',
        errCode: 401
    });
    
}
