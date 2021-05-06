const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('dealer', {
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
                type: DataTypes.TEXT,
                allowNull: true
            },
            company_url: {
                type: DataTypes.TEXT
            },
            activity_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
            },
            status: {
                type: DataTypes.TINYINT,
                allowNull: true
            },
            manager_sr_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            position_activity_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
            },
            link_page: {
                type: DataTypes.STRING,
                allowNull: true
            },
            map_image: {
                type: DataTypes.STRING,
                allowNull: true
            },
            map_image_active: {
                type: DataTypes.STRING,
                allowNull: true
            },
            map_background_image: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lat: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lng: {
                type: DataTypes.STRING,
                allowNull: true
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
            tableName: 'dealer',
            timestamps: false
        });
};

