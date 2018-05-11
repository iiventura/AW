"use strict";

var mysql = require("mysql");
var config = require('.././config');

var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.name
});


module.exports=pool;