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
                type: DataTypes.STRING,

            },
            point_required: {
                type: DataTypes.INTEGER(11),
                allowNull:false,


            },
            sort: {
                type: DataTypes.INTEGER(11),

            },
            invitation: {
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

            },


        },
        {
            tableName: 'lessons',
            timestamps: false
        });
};
