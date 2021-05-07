const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('materials', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(255),
        },
        cat_id: {
            type: DataTypes.INTEGER(11),
        },
        type: {
            type: DataTypes.STRING(255),
        },
        content: {
            type: DataTypes.TEXT,
        },
        content_type: {
            type: DataTypes.STRING(255),
        },
    }, {

        tableName: 'materials',
        timestamps: false,

    });
};