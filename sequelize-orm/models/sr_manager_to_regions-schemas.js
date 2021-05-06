const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('sr_manager_to_regions', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        sr_manager_id: {
            type: DataTypes.INTEGER
        },
        region_activity_id: {
            type: DataTypes.INTEGER,
        }
    },
    {
        tableName: 'sr_manager_to_regions',
        timestamps: false,
    });
};
