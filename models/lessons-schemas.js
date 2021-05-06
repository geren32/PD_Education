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
                type: DataTypes.VARCHAR(255),

            },
            point_required: {
                type: DataTypes.INTEGER(11),
                allowNull:false,


            },
            sort: {
                type: DataTypes.INTEGER(11),

            },
            invitation: {
                type: DataTypes.VARCHAR(255),

            },
            certificate: {
                type: DataTypes.VARCHAR(255),

            },
            presentation: {
                type: DataTypes.VARCHAR(255),

            },
            video: {
                type: DataTypes.VARCHAR(255),

            },


        },
        {
            tableName: 'lessons',
            timestamps: false
        });
};
