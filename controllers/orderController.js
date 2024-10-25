import pool from "../service/db/connection.js";
import db from "../service/db/config.js";
import validator from "email-validator";
import bcrypt from "bcrypt";

export const storeOrder = async (req, res) => {
  try {
    // get user
    const user = req.user;

    // get order data from req body
    const { products } = req.body;

    // check if products exist
    if (!products) {
      return res
        .status(400)
        .send({ error: "Error with getting products from request body!" });
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
          .send({ error: "Product id must be a positive integer!" });
      }

      // check if product quantity is a positive number
      if (
        typeof product.quantity !== "number" ||
        Number(product.quantity) < 1
      ) {
        return res
          .status(400)
          .send({ error: "Product quantity must be a positive integer!" });
      }

      // check if product with current id exists
      const getProduct = await pool.query(
        `SELECT * FROM ${db.productsTable} WHERE id = ?`,
        [product.product_id]
      );

      if (getProduct[0].length === 0) {
        return res
          .status(400)
          .send({ error: "Product with this id not found!" });
      }

      // console.log(getProduct[0]);
    }

    // add new order to the database
    const [newOrder] = await pool.query(
      `INSERT INTO ${db.ordersTable} (user_id, date, status) VALUES (?, NOW(), ?);`,
      [user.id, "new"]
    );

    // throw error if order was not inserted to database
    if (!newOrder.insertId) {
      return res
        .status(400)
        .send({ error: "Error when inserting order to database" });
    }

    let orderInfo = [];
    let getOrderProductRow;
    // add new data to association table
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      const [newOrderProductsRow] = await pool.query(
        `INSERT INTO ${db.orderProductsTable} (order_id, product_id, quantity) VALUES (?, ?, ?);`,
        [newOrder.insertId, product.product_id, product.quantity]
      );

      [getOrderProductRow] = await pool.query(
        `SELECT * FROM ${db.orderProductsTable} WHERE order_id = ?`,
        [newOrder.insertId]
      );

      // throw error if order_products row was not added to database
      if (!newOrderProductsRow.insertId) {
        return res
          .status(400)
          .send({ error: "Error when inserting order to database" });
      }

      orderInfo.push(newOrderProductsRow);
    }

    // get order object from database
    const [createdOrder] = await pool.query(
      `SELECT * FROM ${db.ordersTable} WHERE id = ?;`,
      [newOrder.insertId]
    );

    // return success response with new order
    res.send({ order: createdOrder[0], products: getOrderProductRow });
  } catch (error) {
    console.error("Create new order error:", error);
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
    const getOrders = await pool.query(`SELECT * FROM ${db.ordersTable}`);

    // send success response with list of orders
    res.send(getOrders[0]);
  } catch (error) {
    console.error("Get all orders error:", error);
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
    const orderId = Number(req.params.orderId);

    // check if order with this id exist
    const getOrderById = await pool.query(
      `SELECT * FROM ${db.ordersTable} WHERE id = ?`,
      [orderId]
    );
    if (getOrderById[0].length === 0) {
      return res.status(404).send({ error: "Order with this id not found!" });
    }

    // get current order from database
    const currentOrder = getOrderById[0][0];

    // send success response with list of orders
    res.send(currentOrder);
  } catch (error) {
    console.error("Get order error:", error);
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
    const orderId = Number(req.params.orderId);

    // check if order with this id exist
    const getOrderById = await pool.query(
      `SELECT * FROM ${db.ordersTable} WHERE id = ?`,
      [orderId]
    );
    if (getOrderById[0].length === 0) {
      return res.status(404).send({ error: "Order with this id not found!" });
    }

    // get data from req body
    const { status } = req.body;

    // validate data - status or other data
    const isStatusValid = status.length > 5;
    if (!isStatusValid) {
      return res
        .status(400)
        .send({ error: "Status must be at least 5 characters long!" });
    }

    // update order in database
    const [updatedOrder] = await pool.query(
      `UPDATE ${db.ordersTable} SET status = ? WHERE id = ?;`,
      [status, orderId]
    );

    // get updated order from database
    const [result] = await pool.query(
      `SELECT * FROM ${db.ordersTable} WHERE id = ?;`,
      [orderId]
    );

    // send success response to user
    res.send(result);
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).send({
      error: `An error occurred during updating an order`,
    });
  }
};
