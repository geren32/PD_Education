const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('product_variations', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        sku: {
            type: DataTypes.STRING(45),
        },
        price: {
            type: DataTypes.INTEGER,
        },
        old_price: {
            type: DataTypes.INTEGER,
        },
        product_id: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        gallery: {
            type: DataTypes.TEXT,
        }
    }, {
        tableName: 'product_variations',
        timestamps: false,

    });
};
