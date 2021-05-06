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
            type: DataTypes.VARCHAR(255),
        },
        last_name: {
            type: DataTypes.VARCHAR(255),
        },
        email: {
            type: DataTypes.VARCHAR(255),
        },
        password: {
            type: DataTypes.VARCHAR(255),
            allowNull: false
        },
        phone: {
            type: DataTypes.VARCHAR(255),
        },
        access_token: {
            type: DataTypes.VARCHAR(255),
        },
        refresh_token: {
            type: DataTypes.VARCHAR(255),
        },
        confirm_token: {
            type: DataTypes.VARCHAR(255),
        },
        confirm_token_expiry: {
            type: DataTypes.INTEGER(11),
        },
        confirm_token_type: {
            type: DataTypes.VARCHAR(255),
        },
        last_login: {
            type: DataTypes.INTEGER(11),
        },
        user_type: {
            type: DataTypes.VARCHAR(255),
        },
        avatar: {
            type: DataTypes.VARCHAR(255),
        },
    }, {

        tableName: 'users',
        timestamps: false,

    });
};
