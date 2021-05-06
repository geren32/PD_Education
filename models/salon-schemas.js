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
            type: DataTypes.VARCHAR(255),
        },
        user_id: {
            type: DataTypes.INTEGER(11),
        },
        address: {
            type: DataTypes.VARCHAR(255),
        },
        sales_id: {
            type: DataTypes.VARCHAR(255),
        },
        salon_number: {
            type: DataTypes.VARCHAR(255),
        },
        billing_title: {
            type: DataTypes.VARCHAR(255),
        },
        billing_address: {
            type: DataTypes.VARCHAR(255),
        },
        billing_city: {
            type: DataTypes.VARCHAR(255),
        },
        billing_zip: {
            type: DataTypes.VARCHAR(255),
        },
        billing_nip: {
            type: DataTypes.VARCHAR(255),
        },
        billing_first_name: {
            type: DataTypes.VARCHAR(255),
        },
        billing_last_name: {
            type: DataTypes.VARCHAR(255),
        },
        billing_phone: {
            type: DataTypes.VARCHAR(255),
        },
        billing_email: {
            type: DataTypes.VARCHAR(255),
        },
    }, {

        tableName: 'salon',
        timestamps: false,

    });
};
