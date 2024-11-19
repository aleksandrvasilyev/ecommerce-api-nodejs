import pool from "../service/db/connection.js";
import db from "../service/db/config.js";
import validator from "email-validator";
import bcrypt from "bcrypt";

import db1 from "../models/index.js";
import { validate as isUuid } from "uuid";

const { User } = db1;
export const getUser = async (req, res) => {
  try {
    // get user
    const user = req.user;

    // get uuid
    const uuid = req.params.uuid;

    if (!isUuid(uuid)) {
      return res.status(400).send({
        error: "Invalid UUID format",
      });
    }

    // check if authorized user and params.id is equal
    if (uuid !== user.uuid) {
      return res.status(403).send({ error: "Access forbidden!" });
    }

    // get current user info
    const userInfo = await User.findOne({
      where: { uuid },
      // attributes: ["uuid", "email"],
    });

    res.send(userInfo);
  } catch (error) {
    console.error("Get user error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during getting the user`,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    // get user
    const user = req.user;

    // get id
    const uuid = req.params.uuid;

    if (!isUuid(uuid)) {
      return res.status(400).send({
        error: "Invalid UUID format",
      });
    }

    // check if authorized user passes his uuid in params
    if (uuid !== user.uuid) {
      return res.status(403).send({ error: "Access forbidden!" });
    }

    // get email and password
    const { email, password } = req.body;

    // check if email is not in database
    const getUserByEmail = await User.findOne({
      where: { email },
    });

    if (getUserByEmail) {
      return res.status(400).send({ error: "This email is taken!" });
    }

    // validate email
    const isEmailValid = validator.validate(email);
    if (!isEmailValid) {
      return res.status(400).send({ error: "Input valid email!" });
    }

    // validate password
    const isPasswordValid = password.length >= 6;
    if (!isPasswordValid) {
      return res
        .status(400)
        .send({ error: "Password should be at least 6 characters long!" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // update user in database
    const [updated] = await User.update(
      { email, password: hashedPassword },
      { where: { uuid } }
    );

    if (!updated) {
      return res.status(404).send({ error: "User not found!" });
    }

    // get updated user information
    const updatedUser = await User.findOne({ where: { uuid } });

    //  return success message to the client
    return res.send(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during updating the user`,
    });
  }
};

export const getUserOrders = async (req, res) => {
  // get user
  const user = req.user;

  // get id
  const id = Number(req.params.id);

  // check if authorized user id and params.id is equal
  if (id !== user.id) {
    return res.status(403).send({ error: "Access forbidden!" });
  }

  // get current user orders from database
  const [userOrders] = await pool.query(
    `SELECT * FROM ${db.ordersTable} WHERE user_id = ?;`,
    [user.id]
  );

  // send success request with list of orders
  res.send(userOrders);
};

export const getUserOrder = async (req, res) => {
  // get user
  const user = req.user;

  // get user id from params
  const id = Number(req.params.id);

  // get order id from params
  const orderId = Number(req.params.orderId);

  // check if authorized user and params.id is equal
  if (id !== user.id) {
    return res.status(403).send({ error: "Access forbidden!" });
  }

  // check if order with this id exist
  const getOrderById = await pool.query(
    `SELECT * FROM ${db.ordersTable} WHERE id = ?`,
    [orderId]
  );
  if (getOrderById[0].length === 0) {
    return res.status(404).send({ error: "Order with this id not found!" });
  }

  // check if order id user_id is equal to user id
  if (getOrderById[0][0].user_id !== user.id) {
    return res.status(400).send({ error: "Access forbidden!" });
  }

  // get current order from database
  const currentOrder = getOrderById[0][0];

  // send success response with list of orders
  res.send(currentOrder);
};

export const updateUserOrder = async (req, res) => {
  // get user
  const user = req.user;

  // get user id from params
  const id = Number(req.params.id);

  // get order id from params
  const orderId = Number(req.params.orderId);

  // check if authorized user id and params.id is equal
  if (id !== user.id) {
    return res.status(403).send({ error: "Access forbidden!" });
  }

  // check if order with this id exist
  const getOrderById = await pool.query(
    `SELECT * FROM ${db.ordersTable} WHERE id = ?`,
    [orderId]
  );
  if (getOrderById[0].length === 0) {
    return res.status(404).send({ error: "Order with this id not found!" });
  }

  // check if order id user_id is equal to user id
  if (getOrderById[0][0].user_id !== user.id) {
    return res.status(400).send({ error: "Access forbidden!" });
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
};
