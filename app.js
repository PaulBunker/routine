let express = require('express');
let path = require('path');
//let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let config = require('config');

// Routes
let movement = require('./routes/movement');
let workoutMovement = require('./routes/workoutMovement');
let workout = require('./routes/workout');
let session = require('./routes/session');


//connect to our database
//Ideally you will obtain DB details from a config file
let dbName = 'routine';
let connectionString = config.DBHost + dbName;

mongoose.Promise = global.Promise;
mongoose.connect(connectionString);


let index = require('./routes/index');
let users = require('./routes/users');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api/movement', movement);
app.use('/api/workoutMovement', workoutMovement);
app.use('/api/workout', workout);
app.use('/api/session', session);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  "use strict";
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  "use strict";
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
