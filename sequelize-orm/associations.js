function associations(sequelize) {
    const { bag_items , bag_items_requests , brands , cart , education , education_kilometers, education_report, educator, invoice,
    lessons, materials, materials_cat, orders, products, promotions, sales_massage, sales_person, salon, salon_address, salon_brands,
    salon_lessons, training, users} = sequelize.models;




    users.hasMany(orders,{ foreignKey: 'users_id', sourceKey: 'id'});
    orders.belongsTo(users, { foreignKey: 'users_id', sourceKey: 'id'});

    users.hasMany(education,{ foreignKey: 'education_users_id_fk', sourceKey: 'id'});
    education.belongsTo(users, { foreignKey: 'education_users_id_fk', sourceKey: 'id'});

    users.hasMany(bag_items,{foreignKey: 'bag_items_users_id_fk', sourceKey: 'id'})
    bag_items.belongsTo(users,{foreignKey: 'bag_items_users_id_fk', sourceKey: 'id'})

    users.hasMany(cart,{foreignKey: 'cart_users_id', sourceKey: 'id'})
    cart.belongsTo(users,{foreignKey: 'cart_users_id', sourceKey: 'id'})

    users.hasMany(sales_person,{foreignKey: 'sales_id', sourceKey: 'id'})
    sales_person.belongsTo(users,{foreignKey: 'sales_id', sourceKey: 'id'})

    brands.hasMany(sales_person,{foreignKey: 'sales_person_brands_id_fk', sourceKey: 'id'})
    sales_person.belongsTo(brands,{foreignKey: 'sales_person_brands_id_fk', sourceKey: 'id'})

    brands.hasMany(salon_lessons,{foreignKey: 'salon_lessons_brands_id_fk', sourceKey: 'id'})
    salon_lessons.belongsTo(brands,{foreignKey: 'salon_lessons_brands_id_fk', sourceKey: 'id'})

    brands.hasMany(promotions,{foreignKey: 'promotions_id', sourceKey: 'id'})
    promotions.belongsTo(brands,{foreignKey: 'promotions_id', sourceKey: 'id'})

    brands.hasMany(salon_brands,{foreignKey: 'salon_brands_brands_id_fk', sourceKey: 'id'})
    salon_brands.belongsTo(brands,{foreignKey: 'salon_brands_brands_id_fk', sourceKey: 'id'})

    brands.hasMany(educator,{foreignKey: 'educator_brands_id_fk', sourceKey: 'id'})
    educator.belongsTo(brands,{foreignKey: 'educator_brands_id_fk', sourceKey: 'id'})

    brands.hasMany(materials_cat,{foreignKey: 'materials_cat_brands_id_fk', sourceKey: 'id'})
    materials_cat.belongsTo(brands,{foreignKey: 'materials_cat_brands_id_fk', sourceKey: 'id'})

    materials_cat.hasMany(materials,{foreignKey: 'materials_materials_cat_id_fk', sourceKey: 'id'})
    materials.belongsTo(materials_cat,{foreignKey: 'materials_materials_cat_id_fk', sourceKey: 'id'})

    products.hasMany(cart,{foreignKey: 'products_cart_id_fk', sourceKey: 'id'})
    cart.belongsTo(products,{foreignKey: 'products_cart_id_fk', sourceKey: 'id'})

    educator.hasMany(education,{foreignKey: 'education_educator_id_fk', sourceKey: 'id'})
    education.belongsTo(educator,{foreignKey: 'education_educator_id_fk', sourceKey: 'id'})

    education.hasMany(education_report,{foreignKey: 'education_report_education_id_fk', sourceKey: 'id'})
    education_report.belongsTo(education,{foreignKey: 'education_report_education_id_fk', sourceKey: 'id'})

    salon_address.hasMany(education,{foreignKey: 'address_id', sourceKey: 'id'})
    education.belongsTo(salon_address,{foreignKey: 'address_id', sourceKey: 'id'})




    // user.hasMany(booking,{ foreignKey: 'user_id', sourceKey: 'id'});
    // booking.belongsTo(user,{ foreignKey: 'user_id', sourceKey: 'id'});
    //
    // dealer.hasMany(client,{ foreignKey: 'dealer_id', sourceKey: 'id' });
    // client.belongsTo(dealer, { foreignKey: 'dealer_id', sourceKey: 'id'});
    //
    // booking.hasMany(booking_attachment,{ foreignKey: 'booking_id', sourceKey: 'id'});
    // booking_attachment.belongsTo(booking,{ foreignKey: 'booking_id', sourceKey: 'id'});
    //
    // address.hasMany(booking,{ foreignKey: 'address_id', sourceKey: 'id'});
    // booking.belongsTo(address,{ foreignKey: 'address_id', sourceKey: 'id'});
    //
    // booking.hasMany(orders,{ foreignKey: 'booking_id', sourceKey: 'id'});
    // orders.belongsTo(booking,{ foreignKey: 'booking_id', sourceKey: 'id'});
    //
    // product.hasMany(orders,{ foreignKey: 'product_id', sourceKey: 'id'});
    // orders.belongsTo(product,{ foreignKey: 'product_id', sourceKey: 'id'});

    // product.hasMany(product_variations,{ foreignKey: 'product_id', sourceKey: 'id'});
    //
    // product_variations.belongsTo(product,{ foreignKey: 'product_id', sourceKey: 'id'});

    // product_variations.hasMany(product_to_attribute,{ foreignKey: 'product_variation_id', sourceKey: 'id'});
    // product_to_attribute.belongsTo(product_variations,{ foreignKey: 'product_variation_id', sourceKey: 'id'});
    //
    // attribute.hasMany(product_to_attribute,{ foreignKey: 'attribute_id', sourceKey: 'id'});
    // product_to_attribute.belongsTo(attribute,{ foreignKey: 'attribute_id', sourceKey: 'id'});
    // product_variations.belongsToMany(attribute, {
    //     through: "product_to_attribute",
    //     as: "attribute",
    //     foreignKey: "product_variation_id"
    // });
    //
    // attribute.belongsToMany(product_variations, {
    //     through: "product_to_attribute",
    //     as: "product_variation",
    //     foreignKey: "attribute_id"
    // });
    //
    // product_kit_category.hasMany(product_kit,{ foreignKey: 'id', sourceKey: 'id'});
    //
    // product_kit_category.belongsToMany(product_kit, {
    //     through: "product_kit_to_category_kit",
    //     as: "as_product_kit_category",
    //     foreignKey: "product_kit_category_id"
    // });
    // product_kit.belongsToMany(attribute_kit, {
    //     through: "product_kit_to_attribute",
    //     as: "as_product_kit_to_attribute",
    //     foreignKey: "product_kit_id"
    // });
    // attribute_kit.belongsToMany(product_kit, {
    //     through: "product_kit_to_attribute",
    //     as: "as_product_kit_to_attribute_",
    //     foreignKey: "attribute_kit_id"
    // });
    //
    //
    // product_kit.belongsToMany(product_kit_category, {
    //     through: "product_kit_to_category_kit",
    //     as: "as_category_kit_product",
    //     foreignKey: "product_kit_id"
    // });
    //
    // product.belongsToMany(product_kit, {
    //     through: "product_to_kit",
    //     as: "product_variations_kit_add",
    //
    //     foreignKey: "product_id"
    // });
    //
    // product_kit.belongsToMany(product, {
    //     through: "product_to_kit",
    //     as: "as_product_kit",
    //
    //     foreignKey: "product_kit_id"
    // });

   // product_kit.belongsTo(product_to_kit,{ foreignKey: 'model_id', sourceKey: 'id'});



    // model.hasMany(product,{ foreignKey: 'model_id', sourceKey: 'id'});
    // product.belongsTo(model,{ foreignKey: 'model_id', sourceKey: 'id'});
    //
    // brand.hasMany(product,{ foreignKey: 'brand_id', sourceKey: 'id'});
    // product.belongsTo(brand,{ foreignKey: 'brand_id', sourceKey: 'id'});
    //
    // manufacturer.hasMany(brand,{ foreignKey: 'manufacturer_id', sourceKey: 'id'});
    // brand.belongsTo(manufacturer,{ foreignKey: 'manufacturer_id', sourceKey: 'id'});

    // product.hasMany(product_to_category,{ foreignKey: 'product_id', sourceKey: 'id'});
    // product_to_category.belongsTo(product,{ foreignKey: 'product_id', sourceKey: 'id'});

    // product_category.hasMany(product_to_category,{ foreignKey: 'product_category_id', sourceKey: 'id'});
    // product_to_category.belongsTo(product_category,{ foreignKey: 'product_category_id', sourceKey: 'id'});

    // product.belongsToMany(product_category, {
    //     through: "product_to_category",
    //     as: "category",
    //     foreignKey: "product_id"
    // });
    //
    // product_category.belongsToMany(product, {
    //     through: "product_to_category",
    //     as: "product",
    //     foreignKey: "product_category_id"
    // });
    // posts.belongsToMany(post_category, {
    //     through: "post_to_category",
    //     as: "post_category",
    //     foreignKey: "post_id"
    // });
    //
    // post_category.belongsToMany(posts, {
    //     through: "post_to_category",
    //     as: "posts",
    //     foreignKey: "category_id"
    // });
    // posts.belongsToMany(post_category, {
    //     through: "post_to_category",
    //     as: "posts_to",
    //     foreignKey: "category_id"
    // });
    // posts.belongsToMany(post_category, {
    //     through: "post_to_category",
    //     as: "posts_to_category",
    //     foreignKey: "post_id"
    // });

    // activity.hasMany(client,{ foreignKey: 'activity_id', sourceKey: 'id'});
    // client.belongsTo(activity, { foreignKey: 'activity_id', sourceKey: 'id'});
    //
    // activity.hasMany(dealer,{ foreignKey: 'activity_id', sourceKey: 'id'});
    // dealer.belongsTo(activity, { foreignKey: 'activity_id', sourceKey: 'id'});
    //
    // activity.hasMany(manager_sr,{ foreignKey: 'activity_id', sourceKey: 'id'});
    // manager_sr.belongsTo(activity, { foreignKey: 'activity_id', sourceKey: 'id'});
    //
    // activity.hasMany(manager_blum,{ foreignKey: 'activity_id', sourceKey: 'id'});
    // manager_blum.belongsTo(activity, { foreignKey: 'activity_id', sourceKey: 'id'});
    //
    // position_activity.hasMany(dealer,{ foreignKey: 'position_activity_id', sourceKey: 'id'});
    // dealer.belongsTo(position_activity, { foreignKey: 'position_activity_id', sourceKey: 'id'});
    //
    // position_activity.hasMany(client,{ foreignKey: 'position_activity_id', sourceKey: 'id'});
    // client.belongsTo(position_activity, { foreignKey: 'position_activity_id', sourceKey: 'id'});
    //
    // position_activity.hasMany(manager_sr,{ foreignKey: 'position_activity_id', sourceKey: 'id'});
    // manager_sr.belongsTo(position_activity, { foreignKey: 'position_activity_id', sourceKey: 'id'});
    //
    // user.hasMany(change_dealer_request,{ foreignKey: 'client_user_id', sourceKey: 'id', as: 'client_req'});
    // change_dealer_request.belongsTo(user, { foreignKey: 'client_user_id', sourceKey: 'id', as: 'client_req'});
    //
    // user.hasMany(change_dealer_request,{ foreignKey: 'old_dealer_user_id', sourceKey: 'id', as: 'old_dealer_req'});
    // change_dealer_request.belongsTo(user, { foreignKey: 'old_dealer_user_id', sourceKey: 'id', as: 'old_dealer_req'});
    //
    // user.hasMany(change_dealer_request,{ foreignKey: 'new_dealer_user_id', sourceKey: 'id', as: 'new_dealer_req'});
    // change_dealer_request.belongsTo(user, { foreignKey: 'new_dealer_user_id', sourceKey: 'id', as: 'new_dealer_req'});
    //
    // manager_sr.belongsToMany(region_activity, {
    //     through: "sr_manager_to_regions",
    //     foreignKey: "sr_manager_id",
    //     otherKey: 'region_activity_id'
    // });
    //
    // manager_sr.belongsToMany(region_activity, {
    //     as: "allRegions",
    //     through: "sr_manager_to_regions",
    //     foreignKey: "sr_manager_id",
    //     otherKey: 'region_activity_id'
    // });
    //
    // manager_sr.hasMany(dealer,{ foreignKey: 'manager_sr_id', sourceKey: 'id'});
    // dealer.belongsTo(manager_sr, { foreignKey: 'manager_sr_id', sourceKey: 'id'});
    //
    // manager_sr.hasMany(dealer,{as: 'allDealers', foreignKey: 'manager_sr_id', sourceKey: 'id'});
    // dealer.belongsTo(manager_sr, {as: 'allDealers', foreignKey: 'manager_sr_id', sourceKey: 'id'});
    //
    // dealer.hasMany(change_data_request,{as: 'dealer_before_data', foreignKey: 'dealer_before', sourceKey: 'id'});
    // change_data_request.belongsTo(dealer, {as: 'dealer_before_data', foreignKey: 'dealer_before', sourceKey: 'id'});
    //
    // dealer.hasMany(change_data_request,{as: 'dealer_after_data', foreignKey: 'dealer_after', sourceKey: 'id'});
    // change_data_request.belongsTo(dealer, {as: 'dealer_after_data', foreignKey: 'dealer_after', sourceKey: 'id'});
    //
    // region_activity.hasMany(change_data_request,{as: 'region_before_data', foreignKey: 'region_before', sourceKey: 'id'});
    // change_data_request.belongsTo(region_activity, {as: 'region_before_data', foreignKey: 'region_before', sourceKey: 'id'});
    //
    // region_activity.hasMany(change_data_request,{as: 'region_after_data', foreignKey: 'region_after', sourceKey: 'id'});
    // change_data_request.belongsTo(region_activity, {as: 'region_after_data', foreignKey: 'region_after', sourceKey: 'id'});
    //
    // user.hasMany(change_data_request,{ foreignKey: 'user_id', sourceKey: 'id'});
    // change_data_request.belongsTo(user, { foreignKey: 'user_id', sourceKey: 'id'});
    //
    // booking.hasMany(order_kits, {foreignKey: 'booking_id', sourceKey: 'id'});
    // order_kits.belongsTo(booking,{ foreignKey: 'booking_id', sourceKey: 'id'});
    //
    // product_kit.hasMany(order_kits,{ foreignKey: 'product_kit_id', sourceKey: 'id'});
    // order_kits.belongsTo(product_kit,{ foreignKey: 'product_kit_id', sourceKey: 'id'});
    //
    // user.hasMany(cart,{ foreignKey: 'user_id', sourceKey: 'id'});
    // cart.belongsTo(user,{ foreignKey: 'user_id', sourceKey: 'id'});
    //
    // cart.hasMany(orders, {foreignKey: 'cart_id', sourceKey: 'id'});
    // orders.belongsTo(cart, {foreignKey: 'cart_id', sourceKey: 'id'});
    //
    // cart.hasMany(order_kits, {foreignKey: 'cart_id', sourceKey: 'id'});
    // order_kits.belongsTo(cart, {foreignKey: 'cart_id', sourceKey: 'id'});
    //
    // dealer.hasMany(phone_numbers, {foreignKey: 'dealer_id', sourceKey: 'id'});
    // phone_numbers.belongsTo(dealer, {foreignKey: 'dealer_id', sourceKey: 'id'});
    //
    // posts.hasMany(posts_body, {as: "body", foreignKey: 'post_id', sourceKey: 'id'});
    // posts_body.belongsTo(posts, {as: "body", foreignKey: 'post_id', sourceKey: 'id'});
    //
    // posts.belongsTo(uploaded_images, {as: "image", foreignKey: 'image_id', sourceKey: 'id'});
    // posts.belongsTo(uploaded_images, {as: "banner_image", foreignKey: 'banner_image_id', sourceKey: 'id'});
    // posts.belongsTo(uploaded_images, {as: "banner_image_mobile", foreignKey: 'banner_image_mobile_id', sourceKey: 'id'});
    //
    // posts_body.hasMany(posts_body_to_uploaded_images, {as: "posts_body_images", foreignKey: 'posts_body_id', sourceKey: 'id'});
    // posts_body_to_uploaded_images.belongsTo(posts_body, {as: "posts_body_images", foreignKey: 'posts_body_id', sourceKey: 'id'});
    //
    // posts_body.belongsToMany(uploaded_images, {
    //     as: "gallery_content",
    //     through: "posts_body_to_uploaded_images",
    //     foreignKey: "posts_body_id",
    //     otherKey: 'uploaded_images_id'
    // });
    //
    // booking.hasMany(booking_history, {foreignKey: 'booking_id', sourceKey: 'id'});
    // booking_history.belongsTo(booking, {foreignKey: 'booking_id', sourceKey: 'id'});
    //
    // user.hasMany(booking_history, {foreignKey: 'user_id', sourceKey: 'id'});
    // booking_history.belongsTo(user, {foreignKey: 'user_id', sourceKey: 'id'});
    //
    // booking.hasMany(booking_revision, {foreignKey: 'booking_id', sourceKey: 'id'});
    // booking_revision.belongsTo(booking, {foreignKey: 'booking_id', sourceKey: 'id'});
    //
    // forms.hasMany(form_comments, {foreignKey: 'form_id', sourceKey: 'id'});
    // form_comments.belongsTo(forms, {foreignKey: 'form_id', sourceKey: 'id'});

}

module.exports = { associations };
