const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('post_category', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            status: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0
            },
            position: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            created_user_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            updated_user_id: {
                type: DataTypes.INTEGER,
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
            tableName: 'post_category',
            timestamps: false
        });
};

