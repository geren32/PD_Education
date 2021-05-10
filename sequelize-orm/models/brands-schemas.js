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
            type: DataTypes.STRING,
        },
        logo: {
            type: DataTypes.STRING,
        },
    }, {

        tableName: 'brands',
        timestamps: false,

    });
};
