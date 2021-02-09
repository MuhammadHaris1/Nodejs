var createError = require('http-errors');
var express = require('express');
var bodyParser = require("body-parser")
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/auth');
var dataRouter = require('./routes/data');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use(express.static('public'))

const { MongoClient } = require('mongodb');

// mongoose.connect("mongodb+srv://haris:123@cluster0.1kto7.mongodb.net/test?retryWrites=true&w=majority", {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// 	useCreateIndex: true,
// 	useFindAndModify: false
// })

// async function main() {
//   /**
//    * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
//    * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
//    */
//   const uri = "mongodb+srv://haris:123@cluster0.1kto7.mongodb.net/test?retryWrites=true&w=majority";


//   const client = new MongoClient(uri);

//   try {
//     // Connect to the MongoDB cluster
//     await client.connect();

//     // Make the appropriate DB calls
//     await listDatabases(client);

//   } catch (e) {
//     console.error("error", e);
//   } finally {
//     await client.close();
//   }
// }

// async function listDatabases(client){
//   databasesList = await client.db().admin().listDatabases();
//   console.log("Databases:");
//   databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };

// main().catch(console.error);

mongoose
  .connect("mongodb+srv://haris:123@cluster0.1kto7.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => console.log("DB Connected"));
mongoose.connection.on("error", err => {
  console.log(`DB Connection Error: ${err.message}`);
});
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/get', dataRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
