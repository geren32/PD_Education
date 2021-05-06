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
                type: DataTypes.VARCHAR(255),

            },
            text:{
              type: DataTypes.TEXT
            },
            number: {
                type: DataTypes.VARCHAR(255),
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
