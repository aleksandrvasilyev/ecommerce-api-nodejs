import validator from "email-validator";
import bcrypt from "bcrypt";
import sendOrderConfirmationEmail from "../services/mail/sendOrderConfirmationEmail.js";
import sendFinishAccountRegistrationEmail from "../services/mail/sendFinishAccountRegistrationEmail.js";
import { validate as isUuid } from "uuid";
import db from "../models/index.js";
import { createOrder } from "../services/order/orderService.js";

const { User, Product, Order } = db;

export const storeOrder = async (req, res) => {
  const orderData = {
    user: req.user,
    body: req.body,
  };

  const newOrder = await createOrder(orderData);
  res.status(201).send(newOrder);
};

export const getAllOrders = async (req, res) => {
  try {
    const user = req.user;

    const orders = await Order.findAll();

    res.status(200).send(orders);
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
