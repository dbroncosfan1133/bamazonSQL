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
        startApp();
    });
};

function lowInventory() {
    var productTable = new Table({
        head: [' ID ', ' Product ', ' Department ', ' Price ', ' Stock '],
    });

    var query = "SELECT * FROM products WHERE stock_quantity < 5";

    connection.query(query, function (err, result) {
        if (err) throw err;
        result.forEach(function (column) {
            productTable.push([column.item_id, column.product_name, column.department_name, '$' + column.price, column.stock_quantity])
        });
        console.log("\n" + productTable.toString() + "\n");
        startApp();
    });
};

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

function addNewProduct () {
    inquirer.prompt([
        {
            type: "input",
            name: "prodName",
            message: "Enter the Products name.."
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