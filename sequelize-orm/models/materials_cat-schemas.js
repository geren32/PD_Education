const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('materials_cat', {
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
        type: {
            type: DataTypes.STRING(255),
=======
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
>>>>>>> update commit to me!
        },
        parent_id: {
            type: DataTypes.INTEGER(11),
        },
        brand_id: {
            type: DataTypes.INTEGER(11),
        },
        section: {
            type: DataTypes.INTEGER(11),
        },
    }, {

        tableName: 'materials_cat',
        timestamps: false,

    });
};
