const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('product_kit_to_category_kit', {
        product_kit_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_kit_category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {

        tableName: 'product_kit_to_category_kit',
        timestamps: false,
    });
};
