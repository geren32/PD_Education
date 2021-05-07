function associations(sequelize) {
    const { invoice, salon,orders,
        users, sales_person
    } = sequelize.models;


    // salon.hasMany(invoice,{foreignKey:'salon_id',sourceKey:'id'});
    // invoice.belongsTo(salon,{foreignKey:'salon_id',sourceKey:'id'});

    salon.hasMany(invoice,{ foreignKey: 'salon_id', sourceKey: 'id'});
    invoice.belongsTo(salon,{ foreignKey: 'salon_id', sourceKey: 'id'});

    orders.hasMany(invoice,{ foreignKey: 'order_id', sourceKey: 'id'});
    invoice.belongsTo(orders,{ foreignKey: 'order_id', sourceKey: 'id'});

    users.hasMany(salon,{foreignKey:'user_id',sourceKey:'id'});
    salon.belongsTo(users,{foreignKey:'user_id',sourceKey:'id'});

    sales_person.hasMany(salon,{foreignKey:'sales_id',sourceKey:'id'})
    salon.belongsTo(sales_person,{foreignKey:'sales_id',sourceKey:'id'})






































}

module.exports = { associations };
