require("dotenv").config();
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var data = process.env;

var connection = mysql.createConnection({
    host: data.host,
    port: data.port,
    user: data.user,
    password: data.password,
    database: data.database
});

connection.connect(function (err) {
    if (err) throw err;
    startApp();
})