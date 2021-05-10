const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('educator', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
        },
        brand_id: {
<<<<<<< HEAD
            type: DataTypes.STRING(255),
        },
=======
            type: DataTypes.STRING,
        },
        date: {
            type:DataTypes.INTEGER(11),
        }
>>>>>>> update commit to me!
    }, {

        tableName: 'educator',
        timestamps: false,

    });
};
