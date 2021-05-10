
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
  //  logging: false
    //dialectOptions: { options: { encrypt: true } }
});

const modelDefiners = [
    require('./models/bag_items-schemas'),
    require('./models/bag_items_requests-schemas'),
    require('./models/brands-schemas'),
    require('./models/cart-schemas'),
    require('./models/education-schemas'),
    require('./models/education_kilometers-schemas'),
    require('./models/education_report-schemas'),
    require('./models/educator-schemas'),
    require('./models/invoice-schemas'),
    require('./models/lessons-schemas'),
    require('./models/materials-schemas'),
    require('./models/materials_cat-schemas'),
    require('./models/orders-schemas'),
    require('./models/products-schemas'),
    require('./models/promotions-schemas'),
    require('./models/sales_message-schemas'),
    require('./models/sales_person-schemas'),
    require('./models/salon-schemas'),
    require('./models/salon_address-schemas'),
    require('./models/salon_brands-schemas'),
    require('./models/salon_lessons-schemas'),
    require('./models/training-schemas'),
    require('./models/users-schemas'),
];

// Define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

// Execute extra setup after the models are defined, such as adding associations.
associations(sequelize);


// Export the sequelize connection instance to be used around our app.
module.exports = sequelize;
