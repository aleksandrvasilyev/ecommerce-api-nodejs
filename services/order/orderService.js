import {
  checkProductStock,
  validateProducts,
} from "../product/productService.js";
import { findOrCreateUser } from "../user/userService.js";
import db from "../../models/index.js";
import { sendOrderConfirmationEmail } from "../../helpers/email/emailHelper.js";

const { Order } = db;

export const createOrder = async ({ user, body }) => {
  const { user: userInfo, address, products } = body;

  // find or create user
  const orderUser = await findOrCreateUser(user, userInfo);

  // validate products
  await validateProducts(products);

  // check stock
  await checkProductStock(products);

  // create new order
  const newOrder = await Order.create({
    user_id: orderUser.id,
    address,
    status: "new",
  });

  // send email with confirmation
  try {
    await sendOrderConfirmationEmail(orderUser.email, {
      orderId: newOrder.id,
      address,
      products,
    });
  } catch (error) {
    console.log("Failed to send order confirmation email, continuing:", error);
  }

  // return order
  return {
    user: orderUser,
    order: newOrder,
    products,
  };
  return orderUser;
};
