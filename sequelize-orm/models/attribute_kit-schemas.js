const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('attribute_kit', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.TINYINT,
        },
        type: {
            type: DataTypes.STRING(255),
        },
        group_atr: {
            type: DataTypes.STRING(255),
        }
    }, {

        tableName: 'attribute_kit',
        timestamps: false,
    });
};
