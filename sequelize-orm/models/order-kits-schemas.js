const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('order_kits', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        product_kit_id: {
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
        products: {
            type: DataTypes.TEXT,
        },
        cart_id: {
            type: DataTypes.INTEGER,
        },
        comment: {
            type: DataTypes.STRING,
        }
    }, {

        tableName: 'order_kits',
        timestamps: false,

    });
};
