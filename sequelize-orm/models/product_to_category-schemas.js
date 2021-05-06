const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('product_to_category', {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_category_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        }
    }, {

        tableName: 'product_to_category',
        timestamps: false,
    });
};
