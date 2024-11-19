import pool from "../service/db/connection.js";
import db from "../service/db/config.js";
import validator from "email-validator";
import bcrypt from "bcrypt";
import sendOrderConfirmationEmail from "../service/mail/sendOrderConfirmationEmail.js";
import sendFinishAccountRegistrationEmail from "../service/mail/sendFinishAccountRegistrationEmail.js";
import { validate as isUuid } from "uuid";

import db1 from "../models/index.js";

const { User, Product, Order } = db1;

export const storeOrder = async (req, res) => {
  try {
    // get user and data from req body
    const authorizedUser = req.user;

    const { user, address, products } = req.body;
    const order = {};

    if (!authorizedUser) {
      // unauthorized

      // find user by email in db
      const findUserByEmail = await User.findOne({
        where: { email: user.email },
      });

      // if user does not exist
      if (!findUserByEmail) {
        // create user with automatic password

        // hash random password
        const hashedPassword = await bcrypt.hash(
          Math.random().toString(36).slice(2, 7),
          12
        );

        // save user to database
        const newUser = await User.create({
          email: user.email,
          password: hashedPassword,
          is_temp_password: true,
          role: "user",
          registered: false,
        });

        order.user = newUser;
        order.newUser = true;
      } else {
        order.user = findUserByEmail;
      }
    } else {
      order.user = authorizedUser;
    }

    if (!order.user) {
      return res.status(400).send({ error: "Error creating new user!" });
    }

    // check if products in req body exist
    if (!products) {
      return res.status(400).send({ error: "Products are required!" });
    }

    // validate order information
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      // check if product id is a positive number
      if (
        typeof product.product_id !== "number" ||
        Number(product.product_id) < 1
      ) {
        return res
          .status(400)
          .send({ error: "Product id must be a positive number!" });
      }

      // check if product quantity is a positive number
      if (
        typeof product.quantity !== "number" ||
        Number(product.quantity) < 1
      ) {
        return res
          .status(400)
          .send({ error: "Product quantity must be a positive number!" });
      }

      // check if product with current id exists in db

      const getProduct = await Product.findOne({
        where: { id: product.product_id },
      });

      if (!getProduct) {
        return res
          .status(400)
          .send({ error: `Product with id ${product.product_id} not found!` });
      }
      // TODO check if product quantity is available in association table
    }

    // maybe open new transaction for creating new order and insert data to associated tables
    console.log("start order", order, "end order");
    // add new order to the database
    const newOrder = await Order.create({
      user_id: order.user.id,
      address: address,
      status: "new",
    });

    // TODO start
    // TODO add new data to association table
    // TODO check if product quantity is available
    // add new data to association table
    // let orderInfo = [];
    // let getOrderProductRow;

    // for (let i = 0; i < products.length; i++) {
    //   const product = products[i];

    //   const [newOrderProductsRow] = await pool.query(
    //     `INSERT INTO ${db.orderProductsTable} (order_id, product_id, quantity) VALUES (?, ?, ?);`,
    //     [newOrder.insertId, product.product_id, product.quantity]
    //   );

    //   [getOrderProductRow] = await pool.query(
    //     `SELECT * FROM ${db.orderProductsTable} WHERE order_id = ?`,
    //     [newOrder.insertId]
    //   );

    //   // throw error if order_products row was not added to database
    //   if (!newOrderProductsRow.insertId) {
    //     return res
    //       .status(400)
    //       .send({ error: "Error when inserting order to database" });
    //   }

    //   orderInfo.push(newOrderProductsRow);
    // }
    // TODO end

    if (order.newUser) {
      // TODO send email to finish account registration and create a password
      // TODO generate jwt token
      // sendFinishAccountRegistrationEmail(order.user.email, "token");
    }

    // TODO send email with order confirmation
    // sendOrderConfirmationEmail(order.user.email, getOrderProductRow);

    // return success response with new order
    res.send({
      user: order.user,
      order: newOrder,
      products: products,
    });
  } catch (error) {
    console.error("Create new order error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during creating new order`,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    // get admin user
    const user = req.user;

    // get orders from database
    const orders = await Order.findAll();

    // send success response with list of orders
    res.send(orders);
  } catch (error) {
    console.error("Get all orders error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during getting all orders`,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    // get admin user
    const user = req.user;

    // get order id from params
    const uuid = req.params.orderUUId;

    if (!isUuid(uuid)) {
      return res.status(400).send({
        error: "Invalid UUID format",
      });
    }

    const order = await Order.findOne({ uuid });

    if (order.user_id !== user.id && user.role !== "admin") {
      return res.status(400).send({ error: "Access denied!" });
    }

    // send success response with list of orders
    res.send(order);
  } catch (error) {
    console.error("Get order error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during getting order`,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    // get admin user
    const user = req.user;

    // get order id from params
    const uuid = req.params.orderUUId;

    if (!isUuid(uuid)) {
      return res.status(400).send({
        error: "Invalid UUID format",
      });
    }

    const order = await Order.findOne({ uuid });

    if (order.user_id !== user.id && user.role !== "admin") {
      return res.status(403).send({ error: "Access forbidden!" });
    }

    // get data from req body
    const { status } = req.body;

    const [updated] = await Order.update({ status }, { where: { uuid } });

    if (!updated) {
      return res.status(404).send({ error: "Order not found!" });
    }

    const updatedOrder = await Order.findOne({ where: { uuid } });

    return res.send(updatedOrder);
  } catch (error) {
    console.error("Update order error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during updating an order`,
    });
  }
};
