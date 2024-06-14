-- invoice.sql

-- Create the Invoice database if it doesn't exist
CREATE DATABASE IF NOT EXISTS Invoice;

-- Switch to the Invoice database
USE Invoice;

-- Create the customers table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    business VARCHAR(255) NOT NULL,
    gstNumber VARCHAR(20) NOT NULL,
    sgst VARCHAR(20) NOT NULL,
    cgst VARCHAR(20) NOT NULL
);

-- Insert data into the customers table
INSERT INTO customers (name, address, business, gstNumber, sgst, cgst) VALUES
    ('John', '123 Street, City', 'John\'s Business', 'GST12345', '5%', '5%'),
    ('Jane', '456 Avenue, City', 'Jane\'s Business', 'GST67890', '5%', '5%');

-- Create the records table
CREATE TABLE IF NOT EXISTS records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    business VARCHAR(255) NOT NULL,
    gstNumber VARCHAR(20) NOT NULL,
    sgst VARCHAR(20) NOT NULL,
    cgst VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    stocks INT NOT NULL,
    MarketValue INT NOT NULL,
    total INT NOT NULL
);
