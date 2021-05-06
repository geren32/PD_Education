const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('product_kit_category', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        slag: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.INTEGER,
        },
        updatedAt: {
            type: DataTypes.INTEGER,
        },
        image: {
            type: DataTypes.STRING(255),
        },
        status: {
            type: DataTypes.TINYINT,
        }
    }, {
        tableName: 'product_kit_category',
        timestamps: false,
    });
};
