import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "email-validator";
import { createUser, loginUser } from "../services/user/userService.js";
import db from "../models/index.js";
import { generateAccessToken } from "../services/token/tokenService.js";
// import { validate as isUuid } from "uuid";

const { User } = db;

export const register = async (req, res) => {
  // check request body for email and password
  const { email, password } = req.body;

  const newUser = await createUser(email, password);

  // return success message to the client
  res.status(201).send(newUser);
};

export const login = async (req, res) => {
  // check request body for email and password
  const { email, password } = req.body;

  const { accessToken, refreshToken, user } = await loginUser(email, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // secure: true, // for https in production
    secure: false,
    sameSite: "strict", // for production
    // sameSite: "None",
  });

  // return the token to the client
  res.send({ accessToken, user });
};

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).send({ message: "No refresh token provided" });
  }

  const user = await User.findOne({
    where: { refreshToken: refreshToken },
  });
  // console.log(user);
  const [updatedUser] = await User.update(
    { refreshToken: "" },
    { where: { uuid: user.uuid } }
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    // secure: true, // production
    secure: false,
    sameSite: "strict", // production
    // sameSite: "None",
  });

  res.send({ message: "Logged out successfully" });
};

export const activate = async (req, res) => {};

export const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).send({ message: "Refresh token missing" });
  }

  const user = await User.findOne({
    where: { refreshToken: refreshToken },
  });

  if (!user) {
    return res.status(403).send({ message: "Invalid refresh token" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, userData) => {
      if (err) {
        await User.update({ refreshToken: "" }, { where: { refreshToken } });
        res.clearCookie("refreshToken", {
          httpOnly: true,
          // secure: true, // production
          secure: false,
          sameSite: "strict", // production
        });
        return res.status(403).send({ message: "Invalid refresh token" });
      }

      const accessToken = generateAccessToken(userData.userUUID);

      res.send({
        accessToken,
        user: {
          uuid: user.uuid,
          email: user.email,
          role: user.role,
        },
      });
    }
  );
};
