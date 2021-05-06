const { DataTypes } = require('sequelize');
const config = require('../../configs/config');

module.exports = (sequelize) => {

    sequelize.define('posts', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true
            },
            title: {
                type: DataTypes.TEXT,
            },
            subtitle: {
                type: DataTypes.TEXT,
            },
            image_id: {
                type: DataTypes.INTEGER,
            },
            banner_image_id: {
                type: DataTypes.INTEGER,
            },
            banner_image_mobile_id: {
                type: DataTypes.INTEGER,
            },
            banner_video_id: {
                type: DataTypes.INTEGER,
            },
            status: {
                type: DataTypes.TINYINT,
                defaultValue: config.GLOBAL_STATUSES.WAITING
            },
            position: {
                type: DataTypes.INTEGER,
            },
            created_user_id: {
                type: DataTypes.INTEGER,
            },
            updated_user_id: {
                type: DataTypes.INTEGER,
            },
            type: {
                type: DataTypes.STRING(300),
            },
            slag: {
                type: DataTypes.STRING(300),
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
            tableName: 'posts',
            timestamps: false
        });
};

