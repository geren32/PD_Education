const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('sales_message', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        salon_id: {

            type: DataTypes.INTEGER(11),
        },
        sales_id: {
            type: DataTypes.INTEGER(11),
        },
        date: {
            type: DataTypes.INTEGER(11),
        },
        massage: {
            type: DataTypes.TEXT,
        },
    }, {

        tableName: 'sales_message',
        timestamps: false,

    });
};
