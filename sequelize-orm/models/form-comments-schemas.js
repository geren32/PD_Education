const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('form_comments', {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            form_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            created_at: {
                type: DataTypes.INTEGER
            },
        },
        {
            tableName: 'form_comments',
            timestamps: false
        });
};
