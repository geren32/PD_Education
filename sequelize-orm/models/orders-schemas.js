const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('orders', {
        type: {
            type: DataTypes.STRING(11),

        },
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        product_id: {
            type: DataTypes.INTEGER,

        },
        booking_id: {
            type: DataTypes.INTEGER,
        },
        price: {
            type: DataTypes.FLOAT,
        },
        count: {
            type: DataTypes.INTEGER,
        },
        variation_id: {
            type: DataTypes.INTEGER,
        },
        cart_id: {
            type: DataTypes.INTEGER,
        }
    }, {

        tableName: 'orders',
        timestamps: false,

    });
};
