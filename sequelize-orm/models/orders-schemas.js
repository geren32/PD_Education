const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('orders', {
<<<<<<< HEAD
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
=======
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
>>>>>>> commit to me!
    }, {

        tableName: 'orders',
        timestamps: false,

    });
};
