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
            type: DataTypes.VARCHAR(255),
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
