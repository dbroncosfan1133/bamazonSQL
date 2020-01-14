INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
    ("AMD Ryzen 9 3950X", "Electronics", 799.99, 4),
    ("Samsung Note 10 Plus", "Electronics", 689.99 , 10),
    ("Ribeye Steak", "Meat", 14.99, 15),
    ("Pork Tenderloin", "Meat", 21.79, 3),
    ("Chunk Light Tuna", "Grocery", 1.39, 35),
    ("Whole Coffee Beans", "Grocery", 10.29, 16),
    ("Marshmellow Mateys", "Grocery", 7.49, 18),
    ("Coffee Almond Fudge Ice Cream", "Frozen", 6.49, 17),
    ("Turkey Pot Pie", "Frozen", 3.29, 7),
    ("Star Ruby Grapefruit", "Produce", 1.59, 11),
    ("Strawberrys 1lb", "Produce", 6.49, 9);

INSERT INTO departments (department_name, over_head_costs)
VALUES
    ("Electronics", 750),
    ("Grocery", 500),
    ("Produce", 365),
    ("Meat", 395),
    ("Frozen", 245);

ALTER TABLE products
    ADD product_sales DECIMAL(10,2) NOT NULL DEFAULT 0;