# bamazonSQL

This application is a basic inventory management database/backend of a store front using mySQL and Node.js.  You can start the application by typing "node bamazonCustomer.js", "node bamazonManager.js", or "node bamazonSupervisor.js" in your bash terminal.  Each command will give you different options to select from.

bamazonCustomer.js

-View products for sale:
    This will let you see a catalog of items for sale.  You then will have the option to purchase an item listed in the catalog.  Enter the Item ID you want to purchase and press enter.  You will then be asked "How many would you like to purchase?"  You will be given a prompt showing your total amount due.  The quantity you purchase will be deducted from the "in-stock" quantity.  If you try to purchase more than the stock available the sale will fail.

bamazonManager.js

-View products for sale:
    This will allow the user (manager) to see the catalog of items along with a "Total Sales" column.  This tracks each items total sales dollar amounts.  

-View Low Inventory:
    This will show all inventory items that have a stock quantity of less than 5.

-Add to Inventory:
    This will allow the user to "replenish" an item id's available inventory.  This is the new TOTAL quantity not a quantity added.

-Add New Product:
    This option will allow the user to add new products to the database.  You will enter an Item Name, Item Department, Item Price, and a starting inventory on hand.

bamazonSupervisor.js

-View Product Sales by Department:
    This will show you a list of all departments listed in the database and return its, Id, Name, Over Head Cost, Individual Department Sales numbers, and Net Profit. (Department Sales minus Over Head Cost).

-Create New Department:
    This will allow the user to create a new Department and track sales from items that are assigned to the department.  Note you will need to use bamazonManager.js to add items and assign them to the new department.

++++++ Important ++++++
*******************************************************************************
You will need to create your own connection in MySQL WorkBench; remember your hostname, port, username and your password (if set).  These will need to be entered into your .env file.  Once the connection has been established, open and run the bamazon-db-creation.sql file in MySQL Workbench.  Then run the bamazon-seeds.sql file, this will populate the tables with some starting data.  If you would rather enter your own data do not run this file in MySQL Workbench.  You will be required to match the format of the table.

You also must have the dependencies listed below installed on your PC in the same file location as the cloned files for the javascript portion to work as designed.  Node.js can be installed here: https://node.js.org/en/.  All other dependencies can be installed in a bash terminal using npm (Node Package Manager).

* node.js
* mysql
* inquirer
* cli-table
* dotenv: Create your own .env file and copy below into your .env file, this is where you will store your login credentials, host, port, user, password (if set), and database.

#Bamazon database connections

HOST=127.0.0.1 or whatever private IP you use.
<br>
PORT=3306 (default port)
<br>
USER=root (default unless you change it)
<br>
PASSWORD=your password (if you set one)
<br>
DATABASE=your database name

Once installed, navigate to where you cloned your files in bash and enter any of the 3 file names.
* "node bamazonCustomer.js"
* "node bamazonManager.js"
* "node bamazonSupervisor.js"

********************************************************************************
Watch it work on Youtube:
<br>
<a href="https://youtu.be/bfWTA1tzQ8E">https://youtu.be/bfWTA1tzQ8E</a>

You can also see screenshots in the assets/Images folder in my repo here:
<br>
<a href="https://github.com/dbroncosfan1133/bamazonSQL/tree/master/assets/Images">BamazonSQL Screenshots</a>