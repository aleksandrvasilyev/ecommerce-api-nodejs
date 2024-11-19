import express from "express";
import isAuthorizedOptional from "../middlewares/isAuthorizedOptional.js";
import isAdmin from "../middlewares/isAdmin.js";
import isAuthorized from "../middlewares/isAuthorized.js";
import {
  getAllOrders,
  getOrder,
  storeOrder,
  updateOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/", isAdmin, getAllOrders);
orderRouter.get("/:orderUUId", isAuthorized, getOrder);
orderRouter.post("/", isAuthorizedOptional, storeOrder);
orderRouter.put("/:orderUUId", isAdmin, updateOrder);

export default orderRouter;
