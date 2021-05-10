const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('salon_brands', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        salon_id: {
            type: DataTypes.INTEGER(11),
        },
        brand_id: {
            type: DataTypes.INTEGER(11),
        },
        date: {
            type: DataTypes.INTEGER(11),
        },
    }, {

        tableName: 'salon_brands',
        timestamps: false,

    });
};
