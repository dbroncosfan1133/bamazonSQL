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
            choices: ["View products for sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Leave"]
        }

    ]).then(function (answer) {
        switch (answer.userChoice) {
            case "View products for sale":
                showProducts();
                break;

            case "View Low Inventory":
                lowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addNewProduct();
                break;

            case "Leave":
                connection.end();
                break;
        }
    })
};

//This queries the database and returns a list of products for sale
function showProducts() {
    var productTable = new Table({
        head: [' Item ID: ', ' Product: ', ' Department: ', ' Price: ', ' Stock: ', 'Total Sales:'],
    });

    var query = "SELECT * FROM products";

    connection.query(query, function (err, result) {
        if (err) throw err;
        result.forEach(function (column) {
            productTable.push([column.item_id, 
                column.product_name, 
                column.department_name, 
                '$' + column.price, 
                column.stock_quantity, 
                '$' + column.product_sales]);
        });
        console.log("\n" + productTable.toString() + "\n");
        startApp();
    });
};

//This function queries the database and returns items with an inventory of less than 5
function lowInventory() {
    var productTable = new Table({
        head: [' ID: ', ' Product: ', ' Department: ', ' Price: ', ' Stock: ', 'Total Sales:'],
    });

    var query = "SELECT * FROM products WHERE stock_quantity < 5";

    connection.query(query, function (err, result) {
        if (err) throw err;
        result.forEach(function (column) {
            productTable.push([column.item_id, 
                column.product_name, 
                column.department_name, 
                '$' + column.price, 
                column.stock_quantity, 
                '$' + column.product_sales])
        });
        console.log("\n" + productTable.toString() + "\n");
        startApp();
    });
};

//This function will allow the manager to update the quantity on hand of specific items
function addInventory() {
    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: "What is the new TOTAL quantity?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "stockId",
            message: "What item are we adding stock too?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";

        connection.query(query, [answer.quantity, answer.stockId], function (err) {
            if (err) throw err;
        });
        console.log("Stock has been updated! \n");
        startApp();
    })
};


//This function will allow the manager to add new products.  It will ask for some required information and update the database with the new data
function addNewProduct () {
    inquirer.prompt([
        {
            type: "input",
            name: "prodName",
            message: "Enter the Products name..",
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
            name: "departName",
            message: "Enter a Department..",
        }, 

        {
            type: "input",
            name: "cost",
            message: "Enter the sales price.."
        },

        {
            type: "input",
            name: "startInventory",
            message: "Enter a starting inventory.."
        }
    ]).then(function (prodName) {
        
        var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)";

        connection.query(query, 
            [prodName.prodName, 
                prodName.departName, 
                prodName.cost, 
                prodName.startInventory], 
                function(err, result) {
            if (err) throw err;
        });
        console.log("New product has been entered! \n");
        startApp();
    })
};