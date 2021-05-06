const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('address', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            street: {
                type: DataTypes.STRING(100)
            },
            apartment: {
                type: DataTypes.STRING(5)
            },
            house: {
                type: DataTypes.STRING(5)
            },
            entrance: {
                type: DataTypes.STRING(5)
            },
            floor: {
                type: DataTypes.STRING(5)
            },
            intercom: {
                type: DataTypes.STRING(11)
            },
            district: {
                type: DataTypes.STRING(50)
            },
            city: {
                type: DataTypes.STRING(50)
            },
            country: {
                type: DataTypes.STRING(50)
            },
            first_name: {
                type: DataTypes.STRING(255)
            },
            last_name: {
                type: DataTypes.STRING(255)
            },
            email: {
                type: DataTypes.STRING(255)
            },
            phone: {
                type: DataTypes.STRING(20)
            },
            delivery_type: {
                type: DataTypes.INTEGER
            },
            pay_type: {
                type: DataTypes.INTEGER
            },
            department: {
                type: DataTypes.STRING(5)
            }
        },
        {
            tableName: 'address',
            timestamps: false,


        });
};

