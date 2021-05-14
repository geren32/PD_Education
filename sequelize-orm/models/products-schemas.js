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
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.FLOAT,
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
