const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('menu', {
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
            slag: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            table: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            table_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            status: {
                type: DataTypes.TINYINT,
                allowNull: true
            },
            createdAt: {
                type: DataTypes.INTEGER,
                defaultValue: Math.floor(new Date().getTime() / 1000)
            },
            updatedAt: {
                type: DataTypes.INTEGER,
                defaultValue: Math.floor(new Date().getTime() / 1000)
            }
        },
        {
            tableName: 'menu',
            timestamps: false
        });
};

