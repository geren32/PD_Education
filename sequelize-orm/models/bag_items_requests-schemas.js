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
<<<<<<< HEAD
                type: DataTypes.STRING(255),
=======
                type: DataTypes.STRING,
>>>>>>> update commit to me!

            },
            text:{
              type: DataTypes.TEXT
            },
            number: {
<<<<<<< HEAD
                type: DataTypes.STRING(255),
=======
                type: DataTypes.STRING,
>>>>>>> update commit to me!
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
