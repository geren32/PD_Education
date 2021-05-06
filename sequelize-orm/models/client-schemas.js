const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('client', {
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
            crm_number: {
                type: DataTypes.INTEGER
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
            dealer_id: {
                type: DataTypes.INTEGER,
                foreignKey: true,
                defaultValue: null,
            },
            position_activity_id: {
                type: DataTypes.STRING(100)
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
            tableName: 'client',
            timestamps: false
        });
};

