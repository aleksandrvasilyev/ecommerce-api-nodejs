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

userRouter.get("/:uuid", isAuthorized, getUser);
userRouter.put("/:uuid", isAuthorized, updateUser);
userRouter.get("/:uuid/orders", isAuthorized, getUserOrders);
userRouter.get("/:uuid/orders/:orderId", isAuthorized, getUserOrder);
userRouter.put("/:uuid/orders/:orderId", isAuthorized, updateUserOrder);

export default userRouter;
