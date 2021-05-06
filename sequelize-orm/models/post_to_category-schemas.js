const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('post_to_category', {
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            post_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false
            }
        },
        {
            tableName: 'post_to_category',
            timestamps: false
        });
};

