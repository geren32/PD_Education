const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('brand', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        manufacturer_id: {
            type: DataTypes.INTEGER,
        }
    }, {

        tableName: 'brand',
        timestamps: false,
    });
};
