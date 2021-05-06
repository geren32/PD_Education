const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('invoice', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            salon_id: {
                type: DataTypes.INTEGER(11),
                allowNull:false,

            },
            date: {
                type: DataTypes.INTEGER(11),

            },
            due_data: {
                type: DataTypes.INTEGER(11),

            },
            status: {
                type: DataTypes.STRING(255),

            },
            number: {
                type: DataTypes.STRING(255),
                allowNull:false,

            },
            price: {
                type: DataTypes.INTEGER(11),

            },
            invoice_id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,

            },
            downloaded: {
                type: DataTypes.INTEGER(11),

            },
            order_id: {
                type: DataTypes.INTEGER(11),
                allowNull:false,

            },


        },
        {
            tableName: 'invoice',
            timestamps: false
        });
};
