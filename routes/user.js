import express from "express";
import isAuthorized from "../middlewares/isAuthorized.js";
import {
  getUser,
  getUserOrder,
  getUserOrders,
  updateUser,
  updateUserOrder,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/:id", isAuthorized, getUser);
userRouter.put("/:id", isAuthorized, updateUser);
userRouter.get("/:id/orders", isAuthorized, getUserOrders);
userRouter.get("/:id/orders/:orderId", isAuthorized, getUserOrder);
userRouter.put("/:id/orders/:orderId", isAuthorized, updateUserOrder);

export default userRouter;
