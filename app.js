const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expbs = require('express-handlebars');
const passport = require('passport');
const cors = require('cors');

const passportUtil = require('./utils/passport-util');
let clientRouter = require('./routes/client');


let usersRouter = require('./routes/users');

let adminBrandsRouter = require('./routes/admin.brands')
let educatorRouter = require('./routes/educator');
let authRouter = require('./routes/auth');
let adminAuthRouter = require('./routes/admin.auth');

// let adminProductRouter = require('./routes/admin.product');
let adminUserRouter = require('./routes/admin.user');




// let productRouter = require('./routes/product');
// let importProduct = require('./routes/admin.importProduct');
const moment = require('moment');
// const slag = require('./routes/slag');



// const passportMiddleware = require('./middlewares/passport.middlewares');
// const getClientInfoMiddleware = require('./middlewares/get-client-info.middlewares');



// const metaDataMiddleware = require('./middlewares/meta-data.middleware');

const app = express();

// enabling cors for session storage working on angular frontend, and cookie serving
//exposing headers needed for token sending and receiving
// app.use(cors({
//   //origin: ["http://localhost:4200", "http://localhost", "http://185.233.36.150"],
//   origin: '*',
//   /*credentials: true,*/
//   exposedHeaders: ['Authorization','Impersionate',]
// }));
// off cors
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
const sequelize = require('./sequelize-orm');
// view engine setup
app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));
const hbs = expbs.create({
  extname: '.hbs',
  defaultLayout: false,
  layoutsDir: path.join(__dirname , 'views'), // change layout folder name
  partialsDir: path.join(__dirname , 'views/partials'), // change partials folder name
  helpers: require('./utils/handebar-helpers'),
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// app.use(metaDataMiddleware);
// app.use('/', slag);



app.use('/admin_brands',adminBrandsRouter);
app.use('/educator',educatorRouter);
app.use('/auth', authRouter);
// app.use('/client', getClientInfoMiddleware, clientRouter);
// app.use('/product', productRouter);
// app.use('/import', importProduct);
// app.use('/api/admin/user', adminUserRouter);
app.use('/api/auth/admin', adminAuthRouter);
// app.use('/api/admin/booking', adminBookingRouter);
// app.use('/api/admin/product', adminProductRouter);









// app.use('/', getClientInfoMiddleware, clientRouter);



passportUtil(passport);


// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
app.use(function(err, req, res, next) {
  res
      .status(err.statusCode || err.code || 500)
      .json({
        message: err.message || 'Unexpected',
        errorCode: err.errorCode ? err.errorCode : 0
      })
})

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log('Database connection OK!');
  } catch (error) {
    console.log('Unable to connect to the database:');
    console.log(error.message);
    process.exit(1);
  }
}


async function init() {
  await assertDatabaseConnectionOk();



  /*console.log(`Starting Sequelize + Express example on port ${PORT}...`);
as-
  app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}. Try some routes, such as '/api/users'.`);
  });*/
}

//console.log(Math.floor(new Date().getTime() / 1000));
init();

module.exports = app;
