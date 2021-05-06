const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('booking_history', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            booking_id: {
                type: DataTypes.INTEGER
            },
            user_id: {
                type: DataTypes.INTEGER
            },
            created_at: {
                type: DataTypes.INTEGER
            },
        },
        {
            tableName: 'booking_history',
            timestamps: false
        });
};

