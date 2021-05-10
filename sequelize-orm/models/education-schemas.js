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
<<<<<<< HEAD
            type: DataTypes.STRING(255),
        },
        client_number: {
            type: DataTypes.STRING(255),
=======
            type: DataTypes.STRING,
        },
        client_number: {
            type: DataTypes.STRING,
>>>>>>> update commit to me!
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
<<<<<<< HEAD
            type: DataTypes.STRING(255),
        },
        contact_phone: {
            type: DataTypes.STRING(255),
        },
        contact_email: {
            type: DataTypes.STRING(255),
=======
            type: DataTypes.STRING,
        },
        contact_phone: {
            type: DataTypes.STRING,
        },
        contact_email: {
            type: DataTypes.STRING,
>>>>>>> update commit to me!
        },
        created_date: {
            type: DataTypes.INTEGER(11),
        },
        finished_date: {
            type: DataTypes.INTEGER(11),
        },
<<<<<<< HEAD
        cancell_date: {
            type: DataTypes.INTEGER(11),
        },
        prod_qoute: {
=======
        cancel_date: {
            type: DataTypes.INTEGER(11),
        },
        prod_quote: {
>>>>>>> update commit to me!
            type: DataTypes.INTEGER
        }
    }, {

        tableName: 'education',
        timestamps: false,

    });
};
