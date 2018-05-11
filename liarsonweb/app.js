var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var https = require("https");
var expressValidator = require("express-validator");

var config=require('./config');
const fs = require("fs");


var index = require('./routes/router');

var private_key = fs.readFileSync("./" + config.private_key);
var certificate = fs.readFileSync("./" + config.certificate);


var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

app.use('/', index);


var servidor = https.createServer(
        { key: private_key, cert: certificate },
        app);
        
        
servidor.listen(config.port, (err) => {
    console.log("Escuchando en puerto 5555");
});

module.exports = app;
