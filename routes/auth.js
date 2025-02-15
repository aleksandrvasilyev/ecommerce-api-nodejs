import express from "express";
import isAuthorized from "../middlewares/isAuthorized.js";

import {
  register,
  login,
  logout,
  activate,
  refresh,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/activate/:link", activate);
authRouter.post("/refresh", refresh);

export default authRouter;
