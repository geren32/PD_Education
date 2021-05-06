const { DataTypes } = require('sequelize');
const config = require('../../configs/config');

module.exports = (sequelize) => {

    sequelize.define('posts_body_to_uploaded_images', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true
            },
            posts_body_id: {
                type: DataTypes.INTEGER,
            },
            uploaded_images_id: {
                type: DataTypes.INTEGER,
            }
        },
        {
            tableName: 'posts_body_to_uploaded_images',
            timestamps: false
        });
};

