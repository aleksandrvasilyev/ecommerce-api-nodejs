import express from "express";
import isAuthorized from "../middlewares/isAuthorized.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  getUser,
  getUserOrders,
  updateUser,
  getAllUsers,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", isAdmin, getAllUsers);
userRouter.get("/:uuid/orders", isAuthorized, getUserOrders);
userRouter.get("/:uuid", isAuthorized, getUser);
userRouter.put("/:uuid", isAuthorized, updateUser);

export default userRouter;
