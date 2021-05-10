const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('promotions', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        title: {
<<<<<<< HEAD
            type: DataTypes.STRING(255),
        },
        banner: {
            type: DataTypes.STRING(255),
        },
        file: {
            type: DataTypes.STRING(255),
=======
            type: DataTypes.STRING,
        },
        banner: {
            type: DataTypes.STRING,
        },
        file: {
            type: DataTypes.STRING,
>>>>>>> update commit to me!
        },
        brand_id: {
            type: DataTypes.INTEGER(11),
        },
        add_date: {
            type: DataTypes.INTEGER(11),
        },
        active: {
            type: DataTypes.INTEGER(11),
        },
        start_date: {
            type: DataTypes.INTEGER(11),
        },
        end_date: {
            type: DataTypes.INTEGER(11),
        },
    }, {

        tableName: 'promotions',
        timestamps: false,

    });
};
