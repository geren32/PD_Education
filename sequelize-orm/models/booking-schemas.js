const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('booking', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            date: {
                type: DataTypes.INTEGER
            },
            total_price: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER
            },
            address_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: DataTypes.TINYINT
            },
            old_price: {
                type: DataTypes.INTEGER
            },
            dealer_id: {
                type: DataTypes.INTEGER
            },
            comment: {
                type: DataTypes.TEXT
            },
            createdAt: {
                type: DataTypes.INTEGER
            },
            delivery_price: {
                type: DataTypes.FLOAT
            },
            updatedAt: {
                type: DataTypes.INTEGER
            },
        },
        {
            tableName: 'booking',
            timestamps: false
        });
};

