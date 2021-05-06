const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('links', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            slag: {
                type: DataTypes.STRING
            },
            link: {
                type: DataTypes.STRING
            },
            type: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'links',
            timestamps: false
        });
};
