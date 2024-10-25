import pool from "../service/db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "email-validator";
import db from "../service/db/config.js";

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
  const [result] = await pool.query(
    `SELECT * FROM ${db.usersTable} WHERE email = ?;`,
    [email]
  );
  const user = result[0];

  if (!user) {
    return res.status(401).send({ error: "User was not found!" });
  }

  // check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).send({ error: "Invalid credentials!" });
  }

  // generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // return the token to the client
  res.send({ token });
};

export const register = async (req, res) => {
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

  // check if user already exists in database
  const [user] = await pool.query(
    `SELECT * FROM ${db.usersTable} WHERE email = ?;`,
    [email]
  );

  if (user.length !== 0) {
    return res
      .status(400)
      .send({ error: "User with this email already exist" });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // save user to database
  const [createdUser] = await pool.query(
    `INSERT INTO ${db.usersTable} (email, password, role) VALUES (?, ?, ?);`,
    [email, hashedPassword, "user"]
  );
  const [newUser] = await pool.query(
    `SELECT * FROM ${db.usersTable} WHERE id = ?;`,
    [createdUser.insertId]
  );

  // return success message to the client
  res.status(201).send(newUser[0]);
};
