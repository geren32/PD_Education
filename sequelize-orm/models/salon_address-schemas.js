const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('salon_address', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        salon_id:{
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(255),
        },
        address: {
            type: DataTypes.STRING(255),
        },
        city: {
            type: DataTypes.STRING(255),
        },
        zip: {
            type: DataTypes.STRING(255),
        },
        first_name: {
            type: DataTypes.STRING(255),
        },
        last_name: {
            type: DataTypes.STRING(255),
        },
        phone: {
            type: DataTypes.STRING(255),
        },
        phone_contact: {
            type: DataTypes.STRING(255),

        },
        email: {
            type: DataTypes.STRING(255),
        },
        email_contact: {
            type: DataTypes.STRING(255)
        }
    }, {

        tableName: 'salon_address',
        timestamps: false,

    });
};
