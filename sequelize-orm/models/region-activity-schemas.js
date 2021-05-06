const { DataTypes } = require('sequelize');
const config = require('../../configs/config');

module.exports = (sequelize) => {

    sequelize.define('region_activity', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            region: {
                type: DataTypes.TEXT
            },
            status: {
                type: DataTypes.TINYINT,
                defaultValue: config.GLOBAL_STATUSES.ACTIVE
            },  
             createdAt: {
                type: DataTypes.INTEGER,
                defaultValue: Math.floor(new Date().getTime() / 1000)
            
            },
            updatedAt: {
                type: DataTypes.INTEGER,
              
            },
            deletedAt:{
                type:DataTypes.INTEGER
            }
        },
        {
            tableName: 'region_activity',
            timestamps: false,
            paranoid: false
        });
};

