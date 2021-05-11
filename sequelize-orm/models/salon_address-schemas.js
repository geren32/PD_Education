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
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        zip: {
            type: DataTypes.STRING,
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        phone_contact: {
            type: DataTypes.STRING,

        },
        email: {
            type: DataTypes.STRING,
        },
        email_contact: {
            type: DataTypes.STRING
        }
    }, {

        tableName: 'salon_address',
        timestamps: false,

    });
};
