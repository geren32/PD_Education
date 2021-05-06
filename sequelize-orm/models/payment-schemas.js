const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('payment', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        date: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        service_name: {
            type: DataTypes.STRING(45),

        }
    }, {

        tableName: 'payment',
        timestamps: false,

    });
};
