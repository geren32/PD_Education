const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('lessons', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            brand_id: {
                type: DataTypes.INTEGER(11),
                allowNull:false,

            },
            training_id: {
                type: DataTypes.INTEGER(11),
                allowNull:false,

            },
            title: {
<<<<<<< HEAD
                type: DataTypes.STRING(255),
=======
                type: DataTypes.STRING,
>>>>>>> update commit to me!

            },
            point_required: {
                type: DataTypes.INTEGER(11),
                allowNull:false,


            },
            sort: {
                type: DataTypes.INTEGER(11),

            },
            invitation: {
<<<<<<< HEAD
                type: DataTypes.STRING(255),

            },
            certificate: {
                type: DataTypes.STRING(255),

            },
            presentation: {
                type: DataTypes.STRING(255),

            },
            video: {
                type: DataTypes.STRING(255),
=======
                type: DataTypes.STRING,

            },
            certificate: {
                type: DataTypes.STRING,

            },
            presentation: {
                type: DataTypes.STRING,

            },
            video: {
                type: DataTypes.STRING,
>>>>>>> update commit to me!

            },


        },
        {
            tableName: 'lessons',
            timestamps: false
        });
};
