const { DataTypes } = require('sequelize');

    module.exports = (sequelize) => {

    sequelize.define('user', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            first_name: {
                type: DataTypes.STRING(255),
            },
            last_name: {
                type: DataTypes.STRING(255),
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            phone_id: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            password: {
                type: DataTypes.STRING(300)
            },
            type: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: "client"
            },
            access_token: {
                type: DataTypes.STRING(300)
            },
            refresh_token: {
                type: DataTypes.STRING(300)
            },
            status: {
                type: DataTypes.TINYINT
            },
            region_activity_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
            },
            city: {
                type: DataTypes.TEXT
            },
            index: {
                type: DataTypes.STRING(300)
            },
            mailing_address: {
                type: DataTypes.STRING(300)
            },
            house_number: {
                type: DataTypes.STRING(5)
            },
            apartment_number: {
                type: DataTypes.STRING(5)
            },
            confirm_token: {
                type: DataTypes.STRING
            },
            confirm_token_type: {
                type: DataTypes.STRING
            },
            confirm_token_expires: {
                type: DataTypes.STRING
            },
            email_verified: {
                type: DataTypes.BOOLEAN
            }, 
               createdAt: {
                type: DataTypes.INTEGER,
             defaultValue: Math.floor(new Date().getTime() / 1000)
            },
            updatedAt: {
                type: DataTypes.INTEGER,
                defaultValue: Math.floor(new Date().getTime() / 1000)
            },
            deletedAt:{
                type:DataTypes.INTEGER,
               
            }
        },
        {
            tableName: 'user',
            timestamps: false,
           // paranoid: true
        });
};

