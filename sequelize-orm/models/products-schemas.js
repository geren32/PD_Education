const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('products', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        title: {
<<<<<<< HEAD
            type: DataTypes.STRING(255),
=======
            type: DataTypes.STRING,
>>>>>>> update commit to me!
        },
        price: {
            type: DataTypes.INTEGER(11),
        },
        count: {
            type: DataTypes.INTEGER(11),
        },
        brand_id: {
            type: DataTypes.INTEGER(11),
        },
        created_date: {
            type: DataTypes.INTEGER(11),
        },
    }, {

        tableName: 'products',
        timestamps: false,

    });
};
