const { DataTypes } = require('sequelize');
const config = require('../../configs/config');

module.exports = (sequelize) => {

    sequelize.define('posts_body', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true
            },
            post_id: {
                type: DataTypes.INTEGER,
            },
            type: {
                type: DataTypes.INTEGER,
            },
            content: {
                type: DataTypes.TEXT,
            }
        },
        {
            tableName: 'posts_body',
            timestamps: false
        });
};

