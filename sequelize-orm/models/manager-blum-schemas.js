const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('manager_blum', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            company_name: {
                type: DataTypes.TEXT
            },
            company_url: {
                type: DataTypes.TEXT
            },
            activity_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
            },
            status: {
                type: DataTypes.TINYINT
            },
            createdAt:{
                type:DataTypes.INTEGER,
                defaultValue: Math.floor(new Date().getTime() / 1000)
            },
            updatedAt:{
                type:DataTypes.INTEGER,
                defaultValue: Math.floor(new Date().getTime() / 1000)
            }
        },
        {
            tableName: 'manager_blum',
            timestamps: false
        });
};

