const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('orders', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        date: {
            type: DataTypes.INTEGER(11),

        },
        user_id: {
            type: DataTypes.INTEGER(11),
        },
        products: {
            type: DataTypes.TEXT,
        },
        brand_id: {
            type: DataTypes.INTEGER(11),
        },
        address_id: {
            type: DataTypes.INTEGER(11),
        },
    }, {

        tableName: 'orders',
        timestamps: false,

    });
};
