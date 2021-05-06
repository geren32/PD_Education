const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('booking_attachment', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        booking_id: {
            type: DataTypes.INTEGER,


        },
        path: {
            type: DataTypes.TEXT,

        },
        doc_type: {
            type: DataTypes.STRING(255),

        },
        createdAt:{
            type:DataTypes.INTEGER,
            defaultValue: Math.floor(new Date().getTime() / 1000)
        },
        
        updatedAt:{
            type:DataTypes.INTEGER,
            defaultValue: Math.floor(new Date().getTime() / 1000)
        }
        
    }, {
        tableName: 'booking_attachment',
        timestamps: false,
    });
};
