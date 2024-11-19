import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "email-validator";

import db from "../models/index.js";
// import { validate as isUuid } from "uuid";

const { User } = db;
export const login = async (req, res) => {
  // check request body for email and password
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ error: "Email and password are required!" });
  }

  // check if email is valid
  const isEmailValid = validator.validate(email);
  if (!isEmailValid) {
    return res.status(400).send({ error: "Input valid email!" });
  }

  // find user in the database
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    return res.status(401).send({ error: "User was not found!" });
  }

  // check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).send({ error: "Invalid credentials!" });
  }

  // generate JWT token
  const token = jwt.sign({ userUUId: user.uuid }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // return the token to the client
  res.send({ token });
};

export const register = async (req, res) => {
  try {
    // check request body for email and password
    const { email, password } = req.body;

    // check if email is valid
    const isEmailValid = validator.validate(email);
    if (!isEmailValid) {
      return res.status(400).send({ error: "Input valid email!" });
    }

    // check if password is valid
    const isPasswordValid = password.length >= 6;
    if (!isPasswordValid) {
      return res
        .status(400)
        .send({ error: "Password should be at least 6 characters long!" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // save user to database
    const newUser = await User.create({
      email,
      password: hashedPassword,
      is_temp_password: false,
      registered: true,
    });

    // return success message to the client
    res.status(201).send(newUser);
  } catch (error) {
    console.error("Create page error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during creating the page`,
    });
  }
};
