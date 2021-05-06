
const { Sequelize } = require('sequelize');
const { associations } = require('./associations');
const appUtils = require('../utils/app-util');


const options = appUtils.getArgs();
const mysqlUrl = options['mysql-url'];
const mysqlUser = options['mysql-user'];
const mysqlPassword = options['mysql-password'];
const mysqlDb = options['mysql-db'];

console.log(`Creating connection to mysql: ${mysqlUrl}`);

const sequelize = new Sequelize(mysqlDb, mysqlUser, mysqlPassword, {
    host: mysqlUrl,
    dialect: 'mysql',
<<<<<<< HEAD
    //  logging: false
=======
  //  logging: false
>>>>>>> commit to me!
    //dialectOptions: { options: { encrypt: true } }
});

const modelDefiners = [
<<<<<<< HEAD
    require('./models/invoice-schemas'),
    require('./models/users-schemas'),
    require('./models/salon-schemas'),
    require('./models/orders-schemas'),
  require('./models/sales_person-schemas'),
  require('./models/sales_message-schemas'),
  require('./models/salon_address-schemas'),
  require('./models/salon_brands-schemas'),
  require('./models/brands-schemas'),
  require('./models/promotions-schemas')
=======
    require('./models/dealer-schemas'),
    require('./models/user-schemas'),
    require('./models/menu-schemas'),
    require('./models/pages-schemas'),
    require('./models/manager-sr-schemas'),
    require('./models/region-activity-schemas'),
    require('./models/client-schemas'),
    require('./models/booking-schemas'),
    require('./models/manager-blum-schemas'),
    require('./models/payment-schemas'),
    require('./models/booking_attachment-schemas'),
    require('./models/address-schemas'),
    require('./models/orders-schemas'),
    require('./models/product-schemas'),
    require('./models/product_variations-schemas'),
    require('./models/product_to_attribute-schemas'),
    require('./models/attribute-schemas'),
    require('./models/model-schemas'),
    require('./models/brand-schemas'),
    require('./models/manufacturer-schemas'),
    require('./models/product_to_category-schemas'),
    require('./models/product_category-shemas'),
    require('./models/post_category-schemas'),
    require('./models/post_to_category-schemas'),
    require('./models/posts-schemas'),
    require('./models/position-activity-schemas'),
    require('./models/activity-schemas'),
    require('./models/product_kit-schemas'),
    require('./models/product_kit_category-shemas'),
    require('./models/product_kit_to_category_kit-schemas'),
    require('./models/product_to_kit-schemas'),
    require('./models/change-dealer-request-schemas'),
    require('./models/sr_manager_to_regions-schemas'),

    require('./models/product_kit_to_attribute-schemas'),
    require('./models/attribute_kit-schemas'),

    require('./models/change-data-request-schemas'),
    require('./models/cart-schemas'),
    require('./models/order-kits-schemas'),
    require('./models/links-schemas'),
    require('./models/phone_numbers-schemas'),
    require('./models/uploaded_images-schemas'),
    require('./models/posts_body-schemas'),
    require('./models/posts_body_to_uploaded_images-schemas'),
    require('./models/booking_history-schemas'),
    require('./models/booking_revision-schemas'),
    require('./models/meta-data-schemas'),
    require('./models/product_favorites-schemas'),
    require('./models/form-comments-schemas'),
    require('./models/forms-schemas'),
    require('./models/users-schemas')

>>>>>>> commit to me!
];

// Define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

// Execute extra setup after the models are defined, such as adding associations.
associations(sequelize);


// Export the sequelize connection instance to be used around our app.
module.exports = sequelize;
