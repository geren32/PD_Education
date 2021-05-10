const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('training', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
        },
        file: {
            type: DataTypes.STRING,
        },
        online_option: {
            type: DataTypes.INTEGER(11),
        },
        brand_id: {
            type: DataTypes.INTEGER(11),
        },
        salon_option: {
            type: DataTypes.INTEGER(11),
        },
        qa_option: {
            type:DataTypes.INTEGER(11),
        },
    }, {

        tableName: 'training',
        timestamps: false,

    });
};
