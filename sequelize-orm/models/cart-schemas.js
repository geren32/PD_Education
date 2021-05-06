const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('cart', {
<<<<<<< HEAD
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        date: {
            type: DataTypes.INTEGER(11),
        },
        user_id: {
            type: DataTypes.INTEGER(11),
        },
        product_id: {
            type: DataTypes.INTEGER,
        },
        count: {
            type: DataTypes.INTEGER,
        },
    }, {

        tableName: 'cart',
        timestamps: false,

    });
};
=======
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            date: {
                type: DataTypes.DATE
            },
            total_price: {
                type: DataTypes.FLOAT
            },
            user_id: {
                type: DataTypes.INTEGER
            },
            status: {
                type: DataTypes.TINYINT
            }
        },
        {
            tableName: 'cart',
            timestamps: false
        });
};

>>>>>>> commit to me!
