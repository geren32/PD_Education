const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('salon_lessons', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        brand_id: {
            type: DataTypes.INTEGER(11),
        },
        training_id: {
            type: DataTypes.INTEGER(11),
        },
        lesson_id: {
            type: DataTypes.INTEGER(11),
        },
        salon_id: {
            type: DataTypes.INTEGER(11),
        },
        finished_date: {
            type: DataTypes.INTEGER(11),
        },
        points_received: {
            type: DataTypes.INTEGER(11),
        }
    }, {

        tableName: 'salon_lessons',
        timestamps: false,

    });
};
