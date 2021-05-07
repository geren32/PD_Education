const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('salon', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(255),
        },
        user_id: {
            type: DataTypes.INTEGER(11),
        },
        address: {
            type: DataTypes.STRING(255),
        },
        sales_id: {
            type: DataTypes.STRING(255),
        },
        salon_number: {
            type: DataTypes.STRING(255),
        },
        billing_title: {
            type: DataTypes.STRING(255),
        },
        billing_address: {
            type: DataTypes.STRING(255),
        },
        billing_city: {
            type: DataTypes.STRING(255),
        },
        billing_zip: {
            type: DataTypes.STRING(255),
        },
        billing_nip: {
            type: DataTypes.STRING(255),
        },
        billing_first_name: {
            type: DataTypes.STRING(255),
        },
        billing_last_name: {
            type: DataTypes.STRING(255),
        },
        billing_phone: {
            type: DataTypes.STRING(255),
        },
        billing_email: {
            type: DataTypes.STRING(255),
        },
    }, {

        tableName: 'salon',
        timestamps: false,

    });
};
