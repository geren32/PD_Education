const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('model', {
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
        tableName: 'model',
        timestamps: false,

    });
};
