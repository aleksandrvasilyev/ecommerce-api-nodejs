import express from "express";
import isAuthorizedOptional from "../middlewares/isAuthorizedOptional.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  getAllOrders,
  getOrder,
  storeOrder,
  updateOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", isAuthorizedOptional, storeOrder);
orderRouter.get("/", isAdmin, getAllOrders);
orderRouter.get("/:orderId", isAdmin, getOrder);
orderRouter.put("/:orderId", isAdmin, updateOrder);

export default orderRouter;
