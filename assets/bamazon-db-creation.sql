CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(5,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY(item_id)
);

CREATE TABLE departments
(
    department_id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(7,2) NOT NULL,
    PRIMARY KEY(department_id)
);