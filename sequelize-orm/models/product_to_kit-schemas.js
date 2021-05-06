const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('product_to_kit', {
        product_kit_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        }  ,
        position: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }  ,
        substitute: {
            type: DataTypes.INTEGER,
            allowNull: true,
        } ,
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {

        tableName: 'product_to_kit',
        timestamps: false,
    });
};
