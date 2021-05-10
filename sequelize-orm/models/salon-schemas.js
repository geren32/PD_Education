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
            type: DataTypes.STRING,
        },
        user_id: {
            type: DataTypes.INTEGER(11),
        },
        address: {
            type: DataTypes.STRING,
        },
        sales_id: {
            type: DataTypes.STRING,
        },
        salon_number: {
            type: DataTypes.STRING,
        },
        billing_title: {
            type: DataTypes.STRING,
        },
        billing_address: {
            type: DataTypes.STRING,
        },
        billing_city: {
            type: DataTypes.STRING,
        },
        billing_zip: {
            type: DataTypes.STRING,
        },
        billing_nip: {
            type: DataTypes.STRING,
        },
        billing_first_name: {
            type: DataTypes.STRING,
        },
        billing_last_name: {
            type: DataTypes.STRING,
        },
        billing_phone: {
            type: DataTypes.STRING,
        },
        billing_email: {
            type: DataTypes.STRING,
        },
    }, {

        tableName: 'salon',
        timestamps: false,

    });
};
