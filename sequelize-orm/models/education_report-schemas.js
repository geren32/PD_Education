const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('education_report', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        education_id: {
            type: DataTypes.INTEGER(11),
        },
        invoice_file: {
<<<<<<< HEAD
            type: DataTypes.STRING(255),
=======
            type: DataTypes.STRING,
>>>>>>> update commit to me!
        },
        days: {
            type: DataTypes.INTEGER(11),
        },
        text: {
            type: DataTypes.TEXT,
        },
        response: {
            type: DataTypes.TEXT,
        },
        user_id: {
            type: DataTypes.INTEGER(11),
        },
    }, {

        tableName: 'education_report',
        timestamps: false,

    });
};
