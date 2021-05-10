const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('sales_person', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
        },
        address: {
<<<<<<< HEAD
            type: DataTypes.STRING(255),
        },
        brand_id: {
            type: DataTypes.STRING(255),
=======
            type: DataTypes.STRING,
        },
        brand_id: {
            type: DataTypes.STRING,
>>>>>>> update commit to me!
        },
    }, {

        tableName: 'sales_person',
        timestamps: false,

    });
};
