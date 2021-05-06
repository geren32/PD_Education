const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('cart', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            date: {
                type: DataTypes.DATE
            },
            total_price: {
                type: DataTypes.FLOAT
            },
            user_id: {
                type: DataTypes.INTEGER
            },
            status: {
                type: DataTypes.TINYINT
            }
        },
        {
            tableName: 'cart',
            timestamps: false
        });
};

