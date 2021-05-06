const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('phone_numbers', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            phone: {
                type: DataTypes.STRING(20)
            },
            icon: {
                type: DataTypes.TEXT()
            },
            dealer_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'phone_numbers',
            timestamps: false
        });
};

