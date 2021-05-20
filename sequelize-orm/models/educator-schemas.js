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
            type: DataTypes.STRING,
        },
        availability: {
            type:DataTypes.TEXT,
        },
        required_days: {
            type: DataTypes.INTEGER(11),
        },
        quota: {
            type: DataTypes.INTEGER(11),
        },
        price_per_days: {
            type: DataTypes.INTEGER(11),
        }
    }, {

        tableName: 'educator',
        timestamps: false,

    });
};
