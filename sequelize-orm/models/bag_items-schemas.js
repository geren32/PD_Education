const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('bag_items', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,

            },
            sku: {
                type: DataTypes.STRING,

            },
            image: {
                type: DataTypes.STRING,

            },
            assigned_date: {
                type: DataTypes.INTEGER(11),

            },
            user_id: {
                type: DataTypes.INTEGER(11),
                allowNull:false,

            },
            notice_data: {
                type: DataTypes.INTEGER(11),

            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,

            },
            type: {
                type: DataTypes.STRING,

            },

        },
        {
            tableName: 'bag_items',
            timestamps: false
        });
};
