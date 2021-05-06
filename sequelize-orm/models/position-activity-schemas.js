const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('position_activity', {
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
            tableName: 'position_activity',
            timestamps: false
        });
};

