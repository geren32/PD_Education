function associations(sequelize) {
    const { invoice, salon, orders,
        users, sales_person, sales_message,
        salon_address, salon_brands, brands, promotions,
        materials, materials_cat
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

    salon.hasMany(salon_address, { foreignKey: 'salon_id', sourceKey: 'id' })
    salon_address.belongsTo(salon, { foreignKey: 'salon_id', sourceKey: 'id' })

    salon.hasMany(salon_brands,{foreignKey:'salon_id',sourceKey:'id'})
    salon_brands.belongsTo(salon, {foreignKey:'salon_id',sourceKey:'id'})

    brands.hasMany(salon_brands,{foreignKey:'brand_id',sourceKey:'id'})
    salon_brands.belongsTo(brands, {foreignKey:'brand_id',sourceKey:'id'})
 
    brands.hasMany(promotions,{foreignKey:'brand_id',sourceKey:'id'})
    promotions.belongsTo(brands,{foreignKey:'brand_id',sourceKey:'id'})
    
    brands.hasMany(materials_cat,{foreignKey:'brand_id',sourceKey:'id'})
    materials_cat.belongsTo(brands, {foreignKey:'brand_id',sourceKey:'id'})

    materials_cat.hasMany(materials,{foreignKey:'cat_id',sourceKey:'id'})
    materials.belongsTo(materials_cat,{foreignKey:'cat_id',sourceKey:'id'})























}

module.exports = { associations };
