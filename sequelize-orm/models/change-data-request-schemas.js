const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('change_data_request', {
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
            first_name_before: {
                type: DataTypes.STRING(255)
            },
            first_name_after: {
                type: DataTypes.STRING(255)
            },
            last_name_before: {
                type: DataTypes.STRING(255)
            },
            last_name_after: {
                type: DataTypes.STRING(255)
            },
            client_company_before: {
                type: DataTypes.STRING(255)
            },
            client_company_after: {
                type: DataTypes.STRING(255)
            },
            phone_before: {
                type: DataTypes.STRING(255)
            },
            phone_after: {
                type: DataTypes.STRING(255)
            },
            email_before: {
                type: DataTypes.STRING(255)
            },
            email_after: {
                type: DataTypes.STRING(255)
            },
            region_before: {
                type: DataTypes.INTEGER
            },
            region_after: {
                type: DataTypes.INTEGER
            },
            dealer_before: {
                type: DataTypes.INTEGER
            },
            dealer_after: {
                type: DataTypes.INTEGER
            },
            comment: {
                type: DataTypes.TEXT
            },
            reason_for_rejection: {
                type: DataTypes.TEXT
            },
            is_read_rejection: {
                type: DataTypes.BOOLEAN
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
                default: 0
            },
            createdAt:{
                type: DataTypes.INTEGER,
                defaultValue: Math.floor(new Date().getTime() / 1000)
            },
            updatedAt:{
                type: DataTypes.INTEGER,
                defaultValue: Math.floor(new Date().getTime() / 1000)
            },
        },
        {
            tableName: 'change_data_request',
            timestamps: false
        });
};

