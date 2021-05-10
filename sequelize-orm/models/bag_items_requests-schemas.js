const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('bag_items_requests', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            bag_id: {
                type: DataTypes.INTEGER(11),
                allowNull:false,

            },
            date: {
                type: DataTypes.INTEGER(11),

            },
            status: {
                type: DataTypes.STRING,

            },
            text:{
              type: DataTypes.TEXT
            },
            number: {
                type: DataTypes.STRING,
                allowNull:false,

            },
            responce: {
                type: DataTypes.TEXT

            },
            user_id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,

            },

        },
        {
            tableName: 'bag_items_requests',
            timestamps: false
        });
};
