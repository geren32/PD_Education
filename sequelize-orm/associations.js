function associations(sequelize) {
    const { invoice, salon, orders,
        users, sales_person, sales_message,
        salon_address
    } = sequelize.models;


    // salon.hasMany(invoice,{foreignKey:'salon_id',sourceKey:'id'});
    // invoice.belongsTo(salon,{foreignKey:'salon_id',sourceKey:'id'});

    salon.hasMany(invoice, { foreignKey: 'salon_id', sourceKey: 'id' });
    invoice.belongsTo(salon, { foreignKey: 'salon_id', sourceKey: 'id' });

    orders.hasMany(invoice, { foreignKey: 'order_id', sourceKey: 'id' });
    invoice.belongsTo(orders, { foreignKey: 'order_id', sourceKey: 'id' });

    users.hasMany(salon, { foreignKey: 'user_id', sourceKey: 'id' });
    salon.belongsTo(users, { foreignKey: 'user_id', sourceKey: 'id' });

    sales_person.hasMany(salon, { foreignKey: 'sales_id', sourceKey: 'id' })
    salon.belongsTo(sales_person, { foreignKey: 'sales_id', sourceKey: 'id' })

    users.hasMany(sales_person, { foreignKey: "user_id", sourceKey: 'id' })
    sales_person.belongsTo(users, { foreignKey: "user_id", sourceKey: 'id' })

    salon.hasMany(sales_message, { foreignKey: "salon_id", sourceKey: "id" })
    sales_message.belongsTo(salon, { foreignKey: "salon_id", sourceKey: "id" })

    sales_person.hasMany(sales_message, { foreignKey: "sales_id", sourceKey: "id" })
    sales_message.belongsTo(sales_person, { foreignKey: "sales_id", sourceKey: "id" })


   salon.hasMany(salon_address,{foreignKey:'salon_id',sourceKey:'id'})
   salon_address.belongsTo(salon, {foreignKey:'salon_id',sourceKey:'id'})






























}

module.exports = { associations };
