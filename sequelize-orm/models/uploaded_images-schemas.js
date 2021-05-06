const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('uploaded_images', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            type: {
                type: DataTypes.STRING(45)
            },
            filename: {
                type: DataTypes.TEXT
            },
            width: {
                type: DataTypes.INTEGER
            },
            height: {
                type: DataTypes.INTEGER
            },
            size: {
                type: DataTypes.INTEGER
            },
            alt_text: {
                type: DataTypes.TEXT
            },
            description: {
                type: DataTypes.TEXT
            },
            createdAt:{
                type:DataTypes.INTEGER,
                defaultValue: Math.floor(new Date().getTime() / 1000)
            },
        },
        {
            tableName: 'uploaded_images',
            timestamps: false
        });
};

