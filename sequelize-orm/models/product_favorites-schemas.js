const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('product_favorites', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.INTEGER,
            defaultValue: Math.floor(new Date().getTime() / 1000)
        },
        updatedAt: {
            type: DataTypes.INTEGER,
            defaultValue: Math.floor(new Date().getTime() / 1000)
        }
    }, {

        tableName: 'product_favorites',
        timestamps: true

    });
};
