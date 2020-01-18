//Dependencies required to run app
require("dotenv").config();
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

//stores process.env as variable
var data = process.env;

//Creates connection to SQL Server, information is pulled from local .env file
var connection = mysql.createConnection({
    host: data.host,
    port: data.port,
    user: data.user,
    password: data.password,
    database: data.database
});

//Connects to the SQL server and starts the app
connection.connect(function (err) {
    if (err) throw err;
    startApp();
})

//This starts the app and asks the user what they would like to do
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

//This queries the database and returns a list of products for sale
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

//This will allow the user to enter an item to purchase and how many
//It then runs a function that queries the database, checks stock on hand and will allow the user to 
//purchase the items if enough is in stock or will fail due to the customer trying to purchase more than
//is in inventory
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
            message: "How many would you like to purchase?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
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

//This is ran if purchaseItem() is successful.  It will query the database and return the total amount due for purchase
function finalizePurchase(itemNum, howMany) {

    var query = "SELECT * FROM products WHERE item_id = ?";

    connection.query(query, [itemNum.itemNum], function (err, result) {
        if (err) throw err;
        var stockRemain = result[0].stock_quantity - howMany;
        var sales = parseFloat(result[0].product_sales + (result[0].price * howMany));
        console.log("Your total is: $" + result[0].price * howMany);
        updateStock(itemNum.itemNum, stockRemain, sales);
    })
};

//This function is ran after finalizePurchase is complete.  It will update the database
//and decrease the stock_quantity value.  It will then restart the app.
function updateStock(item_Id, stockRemain, totalSales) {

    var query = "UPDATE products SET stock_quantity = ? , product_sales = ? WHERE item_id = ?";

    connection.query(query, [stockRemain,
        totalSales,
        item_Id],
        function (err) {
            if (err) throw err;
            console.log("Stock has been updated! \n");
            startApp();
        })

    connection.query("SELECT * FROM products ")
};