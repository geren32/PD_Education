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
            type: DataTypes.STRING(255),
        },
        logo: {
            type: DataTypes.STRING(255),
        },
    }, {

        tableName: 'brands',
        timestamps: false,

    });
};
