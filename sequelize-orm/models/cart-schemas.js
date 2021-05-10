const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('cart', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        date: {
            type: DataTypes.INTEGER(11),
        },
        user_id: {
            type: DataTypes.INTEGER(11),
        },
        product_id: {
            type: DataTypes.INTEGER,
        },
        count: {
            type: DataTypes.INTEGER,
        },
    }, {

        tableName: 'cart',
        timestamps: false,

    });
};
