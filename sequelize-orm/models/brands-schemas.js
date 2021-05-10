const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('brands', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        title: {
<<<<<<< HEAD
            type: DataTypes.STRING(255),
        },
        logo: {
            type: DataTypes.STRING(255),
=======
            type: DataTypes.STRING,
        },
        logo: {
            type: DataTypes.STRING,
>>>>>>> update commit to me!
        },
    }, {

        tableName: 'brands',
        timestamps: false,

    });
};
