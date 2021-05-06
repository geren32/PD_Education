const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('users', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING(255),
        },
        last_name: {
            type: DataTypes.STRING(255),
        },
        email: {
            type: DataTypes.STRING(255),
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(255),
        },
        access_token: {
            type: DataTypes.STRING(255),
        },
        refresh_token: {
            type: DataTypes.STRING(255),
        },
        confirm_token: {
            type: DataTypes.STRING(255),
        },
<<<<<<< HEAD
        confirm_token_expiry: {
=======
        confirm_token_expires: {
>>>>>>> commit to me!
            type: DataTypes.INTEGER(11),
        },
        confirm_token_type: {
            type: DataTypes.STRING(255),
        },
        last_login: {
            type: DataTypes.INTEGER(11),
        },
        user_type: {
            type: DataTypes.STRING(255),
        },
        avatar: {
            type: DataTypes.STRING(255),
        },
    }, {

        tableName: 'users',
        timestamps: false,

    });
};
