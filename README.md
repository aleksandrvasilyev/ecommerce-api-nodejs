# E-commerce API Node Js

## Overview

E-commerce application build on Node Js, Express, MySQL. Provides all the necessary functionality: managing products, users, orders and carts. It includes authentication and authorization using JWT, supports secure password storage with bcrypt and easy of integration with frontend clients.

## List of endpoints

| Method   | Endpoint                       |  Access       |  Description                                    |
|----------|--------------------------------|---------------|-------------------------------------------------|
| **Products** | | | |
| `GET`    | `/products`                    | public        | Show all products                               |
| `GET`    | `/products/:id`                | public        | Show details of a specific product              |
| `POST`   | `/products`                    | admin         | Store new product                               |
| `PUT`    | `/products/:id`                | admin         | Update product                                  |
| `DELETE` | `/products/:id`                | admin         | Destroy product                                 |
| `GET`    | `/products/search`             | public        | Search for products                             |
| **Category** | | | |
| `GET`    | `/categories`                  | public        | Show all categories                             |
| `GET`    | `/categories/:id`              | public        | Show details of a specific category             |
| `POST`   | `/categories`                  | admin         | Store new category                              |
| `PUT`    | `/categories/:id`              | admin         | Update category                                 |
| `DELETE` | `/categories/:id`              | admin         | Destroy category                                |
| **Pages** | | | |
| `GET`    | `/pages`                       | public        | Show all pages                                  |
| `GET`    | `/pages/:id`                   | public        | Show details of a specific page                 |
| `POST`   | `/pages`                       | admin         | Store new page                                  |
| `PUT`    | `/pages/:id`                   | admin         | Update page                                     |
| `DELETE` | `/pages/:id`                   | admin         | Destroy page                                    |
| **Auth** | | | |
| `POST`    | `/register`                   | public        | Store new user                                  |
| `POST`    | `/login`                      | public        | Login user                                      |
| `POST`    | `/logout`                     | auth          | Logout user                                     |
| `POST`    | `/reset-password`             | public        | Reset password                                  |
| **Users** | | | |
| `GET`    | `/users`                       | admin         | Show all users                                  |
| `GET`    | `/users/:id`                   | user, admin   | Show user information                           |
| `PUT`    | `/users/:id`                   | user, admin   | Update user information                         |
| `GET`    | `/users/:id/orders`            | user, admin   | Show user orders                                |
| **Orders** | | | |
| `GET`    | `/orders`                      | admin         | Show all orders                                 |
| `GET`    | `/orders/:id`                  | user, admin   | Show order information                          |
| `POST`   | `/orders`                      | user          | Store new order                                 |
| `PUT`    | `/orders/:id`                  | user, admin   | Update order information                        |
| `PATCH`  | `/orders/:id/status`           | admin         | Update order status                             |
