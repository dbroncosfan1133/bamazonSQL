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
            showProducts();
        } else if (userChoice.userChoice === "Leave") {
            connection.end();
        }
    });
}

function showProducts() {
    var productTable = new Table({
        head: [' ID ', ' Product ', ' Department ', ' Price ', ' Stock '],
    });

    var query = "SELECT * FROM products";

    connection.query(query, function (err, result) {
        if (err) throw err;
        result.forEach(function (column) {
            productTable.push([column.item_id, column.product_name, column.department_name, '$' + column.price, column.stock_quantity]);
        });
        console.log("\n" + "\n" + productTable.toString() + "\n");
        purchaseItem();
    });
}

function purchaseItem() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemNum",
            message: "Please enter an Item ID to purchase. (Press q to quit)",
            validate: function (value) {
                if (value === "q") {
                    connection.end();
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            name: "howMany",
            message: "How many would you like to purchase?"
        }
    ]).then(function (itemNum) {

        var query = "SELECT * FROM products WHERE item_id = ?";

        connection.query(query, [itemNum.itemNum], function (err, result) {
            if (err) throw err;
            if (itemNum.howMany > result[0].stock_quantity) {
                console.log("Sorry, we do not have that many...");
                startApp();
            } else {
                console.log("Thank you for your purchase!! \n");
                finalizePurchase(itemNum, itemNum.howMany);
            }
        })
    })
};

function finalizePurchase(itemNum, howMany) {

    var query = "SELECT * FROM products WHERE item_id = ?";

    connection.query(query, [itemNum.itemNum], function (err, result) {
        if (err) throw err;
        var stockRemain = result[0].stock_quantity - howMany;
        console.log("Your total is: $" + result[0].price * howMany);
        updateStock(itemNum.itemNum, stockRemain);
    })
};

function updateStock(item_Id, stockRemain) {

    var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";

    connection.query(query, [stockRemain, item_Id], function (err) {
        if (err) throw err;
        console.log("Stock has been updated! \n");
        startApp();
    })
}

