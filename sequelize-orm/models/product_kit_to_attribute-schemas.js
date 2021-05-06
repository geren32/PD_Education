const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('product_kit_to_attribute', {
        attribute_kit_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        product_kit_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'product_kit_to_attribute',
        timestamps: false,

    });
};
