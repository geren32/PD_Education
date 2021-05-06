const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('booking_revision', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            booking_id: {
                type: DataTypes.INTEGER
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            created_at: {
                type: DataTypes.INTEGER
            },
        },
        {
            tableName: 'booking_revision',
            timestamps: false
        });
};

