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
            type: DataTypes.STRING,
        },
        client_number: {
            type: DataTypes.STRING,
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
            type: DataTypes.STRING,
        },
        contact_phone: {
            type: DataTypes.STRING,
        },
        contact_email: {
            type: DataTypes.STRING,
        },
        created_date: {
            type: DataTypes.INTEGER(11),
        },
        finished_date: {
            type: DataTypes.INTEGER(11),
        },
        cancel_date: {
            type: DataTypes.INTEGER(11),
        },
        prod_quote: {
            type: DataTypes.INTEGER
        }
    }, {

        tableName: 'education',
        timestamps: false,

    });
};
