import pool from "../service/db/connection.js";
import db from "../service/db/config.js";
import validator from "email-validator";
import bcrypt from "bcrypt";

export const getUser = async (req, res) => {
  // get user
  const user = req.user;

  // get id
  const id = Number(req.params.id);

  // check if authorized user and params.id is equal
  if (id !== user.id) {
    return res.status(403).send({ error: "Access forbidden!" });
  }

  // get current user info
  const [userInfo] = await pool.query(
    `SELECT id, email, role FROM ${db.usersTable} WHERE id = ?;`,
    [user.id]
  );

  res.send(userInfo[0]);
};

export const updateUser = async (req, res) => {
  // get user
  const user = req.user;

  // get id
  const id = Number(req.params.id);

  // get email and password
  const { email, password } = req.body;

  // check if email is not in database
  const getUserByEmail = await pool.query(
    `SELECT * FROM ${db.usersTable} WHERE email = ?`,
    [email]
  );
  if (getUserByEmail[0].length !== 0) {
    return res.status(400).send({ error: "This email is taken!" });
  }

  // check if authorized user id and params.id is equal
  if (id !== user.id) {
    return res.status(403).send({ error: "Access forbidden!" });
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
  const [updatedUser] = await pool.query(
    `UPDATE ${db.usersTable} SET email = ?, password = ? WHERE id = ?;`,
    [email, hashedPassword, id]
  );

  const [newUser] = await pool.query(
    `SELECT * FROM ${db.usersTable} WHERE id = ?;`,
    [id]
  );

  // return success message to the client
  res.status(201).send(newUser[0]);
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
