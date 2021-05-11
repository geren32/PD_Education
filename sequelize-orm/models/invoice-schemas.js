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
<<<<<<< HEAD
                type: DataTypes.STRING(255),

            },
            number: {
                type: DataTypes.STRING(255),
=======
                type: DataTypes.STRING,

            },
            number: {
                type: DataTypes.STRING,
>>>>>>> update commit to me!
                allowNull:false,

            },
            price: {
                type: DataTypes.INTEGER(11),

            },
            invoice_id: {
                type: DataTypes.INTEGER(11),
<<<<<<< HEAD
                // allowNull: false,
=======
                allowNull: false,
>>>>>>> update commit to me!

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
