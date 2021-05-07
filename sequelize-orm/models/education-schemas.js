const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('education', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
        },
        date: {
            type: DataTypes.INTEGER(11),
        },
        hours: {
            type: DataTypes.STRING(255),
        },
        client_number: {
            type: DataTypes.STRING(255),
        },
        address_id: {
            type: DataTypes.INTEGER(11),
        },
        brand_id: {
            type: DataTypes.INTEGER(11),
        },
        lesson_id: {
            type: DataTypes.INTEGER(11),
        },
        training_id: {
            type: DataTypes.INTEGER(11),
        },
        salon_id: {
            type: DataTypes.INTEGER(11),
        },
        education_type: {
            type: DataTypes.INTEGER(11),
        },
        person_count: {
            type: DataTypes.INTEGER(11),
        },
        education_status: {
            type: DataTypes.STRING(255),
        },
        contact_phone: {
            type: DataTypes.STRING(255),
        },
        contact_email: {
            type: DataTypes.STRING(255),
        },
        created_date: {
            type: DataTypes.INTEGER(11),
        },
        finished_date: {
            type: DataTypes.INTEGER(11),
        },
        cancell_date: {
            type: DataTypes.INTEGER(11),
        },
        prod_qoute: {
            type: DataTypes.INTEGER
        }
    }, {

        tableName: 'education',
        timestamps: false,

    });
};
