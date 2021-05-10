const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('materials', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
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
        cat_id: {
            type: DataTypes.INTEGER(11),
        },
        type: {
<<<<<<< HEAD
            type: DataTypes.STRING(255),
=======
            type: DataTypes.STRING,
>>>>>>> update commit to me!
        },
        content: {
            type: DataTypes.TEXT,
        },
        content_type: {
<<<<<<< HEAD
            type: DataTypes.STRING(255),
=======
            type: DataTypes.STRING,
>>>>>>> update commit to me!
        },
    }, {

        tableName: 'materials',
        timestamps: false,

    });
};
