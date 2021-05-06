const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('education_kilometers', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
        },
        report_id: {
            type: DataTypes.INTEGER(11),
        },
        education_id: {
            type: DataTypes.INTEGER(11),
        },
        kilometers: {
            type: DataTypes.INTEGER(11),
        },
        additional: {
            type: DataTypes.INTEGER(11),
        },
        invoice_file: {
            type: DataTypes.STRING(255),
        },
    }, {

        tableName: 'education_kilometers',
        timestamps: false,

    });
};
