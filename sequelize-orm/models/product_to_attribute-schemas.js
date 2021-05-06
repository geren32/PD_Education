const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('product_to_attribute', {
        attribute_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        product_variation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'product_to_attribute',
        timestamps: false,

    });
};
