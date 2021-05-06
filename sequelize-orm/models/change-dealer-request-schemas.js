const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('change_dealer_request', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            client_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            old_dealer_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            new_dealer_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
                default: 0
            },
            comment: {
                type: DataTypes.TEXT
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
            tableName: 'change_dealer_request',
            timestamps: false
        });
};

