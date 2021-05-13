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
            type: DataTypes.STRING,
        },
        client_number: {
            type: DataTypes.STRING,
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
            type: DataTypes.STRING,
            allowNull:false
        },
        contact_phone: {
            type: DataTypes.STRING,
        },
        contact_email: {
            type: DataTypes.STRING,
        },
        contacted_date: {
            type: DataTypes.INTEGER,
        },
        created_date: {
            type: DataTypes.INTEGER,
        },
        finished_date: {
            type: DataTypes.INTEGER,
        },
        cancel_date: {
            type: DataTypes.INTEGER,
        },
        prod_quote: {
            type: DataTypes.INTEGER
        }
    }, {

        tableName: 'education',
        timestamps: false,

    });
};
