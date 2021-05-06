const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('educator', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
        },
        brand_id: {
            type: DataTypes.VARCHAR(255),
        },
    }, {

        tableName: 'educator',
        timestamps: false,

    });
};
