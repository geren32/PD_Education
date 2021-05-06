const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('attribute', {
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
            type: DataTypes.TEXT,
        },
        group_atr: {
            type: DataTypes.STRING(255),
        },
        unit_of_measurement: {
            type: DataTypes.TEXT,
        },
        position: {
            type: DataTypes.INTEGER,
        }
    }, {

        tableName: 'attribute',
        timestamps: false,
    });
};
