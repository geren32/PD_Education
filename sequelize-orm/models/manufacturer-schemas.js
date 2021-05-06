const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('manufacturer', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'manufacturer',
        timestamps: false,
    });
};
