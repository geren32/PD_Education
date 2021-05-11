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
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.INTEGER,
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
            type: DataTypes.INTEGER,
            allowNull:false
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        lesson_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        training_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        salon_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        education_type: {
            type: DataTypes.INTEGER,
        },
        person_count: {
            type: DataTypes.INTEGER,
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
            allowNull:false
        },
        contact_phone: {
            type: DataTypes.STRING,
        },
        contact_email: {
            type: DataTypes.STRING,
>>>>>>> update commit to me!
        },
        created_date: {
            type: DataTypes.INTEGER,
        },
        finished_date: {
            type: DataTypes.INTEGER,
        },
<<<<<<< HEAD
        cancell_date: {
            type: DataTypes.INTEGER(11),
        },
        prod_qoute: {
=======
        cancel_date: {
            type: DataTypes.INTEGER,
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
