import validator from "email-validator";
import bcrypt from "bcrypt";
import { validate as isUuid } from "uuid";
import db from "../models/index.js";

const { User, Order } = db;

export const getAllUsers = async (req, res) => {
  try {
    // get user
    const user = req.user;

    // get all users
    const users = await User.findAll({
      // attributes: ["uuid", "email"],
    });

    res.send(users);
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
  // get current authorized user
  const user = req.user;

  // extract uuid from request parameters
  const targetUserUuid = req.params.uuid;

  // validate uuid format
  if (!isUuid(targetUserUuid)) {
    return res.status(400).send({
      error: "Invalid UUID format",
    });
  }

  // find the target user by UUID
  const targetUser = await User.findOne({ where: { uuid: targetUserUuid } });

  if (!targetUser) {
    return res.status(404).send({
      error: "User not found",
    });
  }

  // check access permissions
  if (user.role !== "admin" && user.id !== targetUser.id) {
    return res.status(403).send({
      error: "Access denied",
    });
  }

  // get orders of the target user
  const orders = await Order.findAll({
    where: { user_id: targetUser.id },
  });

  // send success request with list of orders
  res.send(orders);
};
