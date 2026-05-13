CREATE DATABASE IF NOT EXISTS PIMS;
USE PIMS;

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS category (
    categoryId INT PRIMARY KEY,
    categoryName VARCHAR(100) NOT NULL,
    storageInstructions VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS medicine (
    medicineId INT PRIMARY KEY,
    categoryId INT NOT NULL,
    tradeName VARCHAR(100) NOT NULL,
    genericName VARCHAR(100) NOT NULL,
    unitPrice DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES category(categoryId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS inventoryStock (
    stockNumber INT PRIMARY KEY,
    medicineId INT NOT NULL,
    quantityInhand INT NOT NULL,
    expiryDate DATE NOT NULL,
    FOREIGN KEY (medicineId) REFERENCES medicine(medicineId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS sales (
    saleNumber INT PRIMARY KEY,
    medicineId INT NOT NULL,
    quantitySold INT NOT NULL,
    totalAmount DECIMAL(10,2) NOT NULL,
    SaleDate DATE NOT NULL,
    FOREIGN KEY (medicineId) REFERENCES medicine(medicineId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
