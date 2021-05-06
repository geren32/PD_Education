const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('activity', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            title: {
                type: DataTypes.TEXT
            }
        },
        {
            tableName: 'activity',
            timestamps: false
        });
};

