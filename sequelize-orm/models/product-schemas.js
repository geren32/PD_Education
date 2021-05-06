const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('product', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        variation: {
            type: DataTypes.TEXT,
        },
        type: {
            type: DataTypes.STRING(10),
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        created_user_id: {
            type: DataTypes.INTEGER,
        },
        updated_user_id: {
            type: DataTypes.INTEGER,
        },
        short_description: {
            type: DataTypes.TEXT,
        },
        description: {
            type: DataTypes.TEXT,
        },
        slag: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        color: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(255),
        },
        price: {
            type: DataTypes.INTEGER,
        },
        old_price: {
            type: DataTypes.INTEGER,
        },
        availability: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        brand_id: {
            type: DataTypes.INTEGER,
        },
        model_id: {
            type: DataTypes.INTEGER,
        },
        sku: {
            type: DataTypes.STRING(45),

        },
        promotional: {
            type: DataTypes.TEXT,

        },
        novelty: {
            type: DataTypes.TEXT,

        },
        popular: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        gallery: {
            type: DataTypes.TEXT,
        },
        promo_label: {
            type: DataTypes.STRING(255),
        },
        recommended_products: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        similar_products: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        characteristic: {
            type: DataTypes.TEXT,
            allowNull: true
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

        tableName: 'product',
        timestamps: false,

    });
};
