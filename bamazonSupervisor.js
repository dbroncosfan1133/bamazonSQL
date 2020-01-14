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
            choices: ["View Product Sales by Department",
                "Create New Department",
                "Leave"]
        }

    ]).then(function (answer) {
        switch (answer.userChoice) {
            case "View Product Sales by Department":
                showDepartMetrics();
                break;

            case "Create New Department":
                showDepartments();
                break;

            case "Leave":
                connection.end();
                break;
        }
    })
};

function showDepartMetrics() {
    var departmentTable = new Table({
        head: [' Department ID: ', ' Department: ', ' Over Head Cost: ', ' Department Sales: ', 'Net Profit:'],
    });

    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS department_sales, SUM(products.product_sales) - departments.over_head_costs AS net_profit FROM departments INNER JOIN products ON (departments.department_name = products.department_name) GROUP BY departments.department_name ORDER BY department_id";

    connection.query(query, function (err, result) {
        if (err) throw err;
        result.forEach(function (column) {
            departmentTable.push([column.department_id,
            column.department_name, "$" +
            column.over_head_costs,
            "$" + column.department_sales,
            "$" + column.net_profit]);
        });
        console.log("\n" + departmentTable.toString() + "\n");
        startApp();
    })
};

function showDepartments() {
    var departmentTable = new Table({
        head: [' Department ID: ', ' Department: ', 'Over Head Cost: '],
    });

    var query = "SELECT * FROM departments";

    connection.query(query, function (err, result) {
        if (err) throw err;
        result.forEach(function (column) {
            departmentTable.push([column.department_id,
            column.department_name,
            "$" + column.over_head_costs])
        });
        console.log("\n" + departmentTable.toString() + "\n");
        newDepartment();
    });
};

function newDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "departName",
            message: "Enter new Department name.."
        },
        {
            type: "input",
            name: "overHeadCost",
            message: "Enter the Department Over Head Costs.."
        }
    ]).then(function (departName) {

        var query = "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)";

        connection.query(query,
            [departName.departName,
            departName.overHeadCost],
            function (err, result) {
                if (err) throw err;
            });
        console.log("\nDepartment has been added!\n");
        startApp();
    })
};