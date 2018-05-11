var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require("express-validator");
var config=require('./config');


/*SESIONES*/
var session = require("express-session");
var mysqlSession = require("express-mysql-session");
var MySQLStore = mysqlSession(session);
var sessionStore = new MySQLStore({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.name
});

var middlewareSession = session({
    saveUninitialized: false,
    secret: "practica1",
    resave: false,
    store: sessionStore
});


var router = require('./routes/router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(middlewareSession);
app.use(expressValidator());

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
