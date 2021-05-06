const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('product_category', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        slag: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // created_at: {
        //     type: DataTypes.INTEGER,
        // },
        // updated_at: {
        //     type: DataTypes.INTEGER,
        // },
        image: {
            type: DataTypes.STRING(255),
        },
        status: {
            type: DataTypes.TINYINT,
        }
    }, {
        tableName: 'product_category',
        timestamps: false,
    });
};
