-- DROP DATABASE IF EXISTS online_store;
-- CREATE DATABASE online_store;
-- USE online_store;

-- categories
DROP TABLE IF EXISTS categories;

CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
);

INSERT INTO `categories` VALUES (1, 'Category 1'), (2, 'Category 2'), (3, 'Category 3'), (4, 'Category 4');

-- users
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS `users` (
	`id` INT NOT NULL UNIQUE AUTO_INCREMENT,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`password` VARCHAR(255) NOT NULL,
	`is_temp_password` TINYINT(1) DEFAULT 0,
	`role` VARCHAR(50) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
	`registered` TINYINT(1) DEFAULT 1,
	PRIMARY KEY (`id`)
);

-- INSERT INTO `users` VALUES (1, 'admin@website.com', '$2a$12$jllNkYA1YPVxdM8CjQmYe.s3.MT99az.W4HDrOp/X5UCcqgyQ9zXG', 'admin'); -- password123
INSERT INTO `users` (`id`, `email`, `password`) VALUES (2, 'user1@website.com', '$2a$12$q/Mw/hbAvTxXnbiyt7glXOUX.mZuKAwieVgi.EhTQhlc.G9GZF.Um'); -- password123
INSERT INTO `users` (`id`, `email`, `password`) VALUES (3, 'user2@website.com', '$2a$12$q/Mw/hbAvTxXnbiyt7glXOUX.mZuKAwieVgi.EhTQhlc.G9GZF.Um'); -- password123


-- products
DROP TABLE IF EXISTS products;

CREATE TABLE IF NOT EXISTS `products` (
	`id` INT NOT NULL UNIQUE AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL DEFAULT '',
	`description` TEXT NOT NULL,
	`price` DECIMAL(10,0) NOT NULL,
	`category_id` INT NOT NULL,
	PRIMARY KEY (`id`),
	CONSTRAINT `products_fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
);

INSERT INTO `products` 
VALUES 
(1, 'Product 1', 'Description product 1', 100, 1),
(2, 'Product 2', 'Description product 2', 150, 2),
(3, 'Product 3', 'Description product 3', 200, 4),
(4, 'Product 4', 'Description product 4', 300, 3);


-- pages
DROP TABLE IF EXISTS pages;

CREATE TABLE IF NOT EXISTS `pages` (
  `id` INT NOT NULL UNIQUE AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL DEFAULT '',
  `description` TEXT NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `pages` VALUES 
(1, 'Page 1', 'Description page 1'),
(2, 'Page 2', 'Description page 2'),
(3, 'Page 3', 'Description page 3'),
(4, 'Page 4', 'Description page 4');


-- orders
DROP TABLE IF EXISTS orders;

CREATE TABLE IF NOT EXISTS `orders` (
	`id` INT AUTO_INCREMENT NOT NULL UNIQUE,
	`user_id` INT NOT NULL,
	`address` VARCHAR(255) NOT NULL,
	`date` datetime NOT NULL,
	`status` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`),
	CONSTRAINT `orders_fk_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

INSERT INTO `orders` VALUES 
(1, 2, 'Prinsengracht 320, 1016 GZ Amsterdam', NOW(), 'new'),
(2, 3, 'Prinsengracht 321, 1016 GZ Amsterdam', NOW(), 'new'),
(3, 2, 'Prinsengracht 322, 1016 GZ Amsterdam', NOW(), 'new'),
(4, 3, 'Prinsengracht 323, 1016 GZ Amsterdam', NOW(), 'new');


-- order-products
DROP TABLE IF EXISTS order_products;

CREATE TABLE IF NOT EXISTS `order_products` (
	`id` INT AUTO_INCREMENT NOT NULL UNIQUE,
	`order_id` INT NOT NULL,
	`product_id` INT NOT NULL,
	`quantity` INT NOT NULL,
	PRIMARY KEY (`id`),
	CONSTRAINT `order_products_fk1` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
	CONSTRAINT `order_products_fk2` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
);

INSERT INTO `order_products` VALUES 
(1, 1, 1, 1),
(2, 1, 2, 2),

(3, 2, 1, 2),
(4, 2, 3, 4),

(5, 3, 2, 5),
(6, 3, 1, 1),

(7, 4, 3, 1),
(8, 4, 4, 2),
(9, 4, 1, 1);