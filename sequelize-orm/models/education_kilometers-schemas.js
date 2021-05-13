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
            allowNull: false,
        },
        report_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        education_id: {
            type: DataTypes.INTEGER(11),
            allowNull:false,
        },
        kilometers: {
            type: DataTypes.INTEGER(11),
        },
        additional: {
            type: DataTypes.INTEGER(11),
        },
        invoice_file: {
            type: DataTypes.STRING,
        },
    }, {

        tableName: 'education_kilometers',
        timestamps: false,

    });
};
