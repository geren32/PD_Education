const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('forms', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.TINYINT,
                allowNull: false,
            },
            emails: {
                type: DataTypes.TEXT
            }
        },
        {
            tableName: 'forms',
            timestamps: false
        });
};
