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

function startApp() {
    inquirer.prompt([

        {
            type: "list",
            name: "userChoice",
            message: "What would you like to do?",
            choices: ["View products for sale", "Leave"]
        }

    ]).then(function (userChoice) {
        if (userChoice.userChoice === "View products for sale") {
            showProducts()
        } else {
            connection.end();
        }
    });
}

function showProducts() {
    var productTable = new Table({
        head: [' ID ', ' Product ', ' Department ', ' Price ', ' Stock '],
    });
    connection.query("SELECT * FROM products;",
        function (err, result) {
            if (err) throw err;
            result.forEach(function (column) {
                productTable.push([column.item_id, column.product_name, column.department_name, '$' + column.price, column.stock_quantity]);
            });
            console.log("\n" + "\n" + productTable.toString() + "\n");
            purchaseItem();
        });

    function purchaseItem() {
        connection.query("SELECT * FROM products", function (err, result) {
            inquirer.prompt([
                {
                    type: "list",
                    name: "shopList",
                    message: "What would you like to purchase?",
                    choices: function () {
                        var choiceList = [];
                        for (var i = 0; i < result.length; i++) {
                            choiceList.push(result[i].product_name);
                        }
                        return choiceList;
                    }
                },

                {
                    type: "input",
                    name: "howMany",
                    message: "How many would you like?"
                },

                {
                    type: "confirm",
                    name: "confirmChoice",
                    message: "Would you like to quit?"
                }

            ]).then(function (confirmChoice) {
                if (confirmChoice.confirmChoice === true) {
                    connection.end();
                }
            })
        })
    }
}