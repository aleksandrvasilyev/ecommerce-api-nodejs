import jwt from "jsonwebtoken";
// import mysql from "mysql2/promise";
import pool from "../service/db/connection.js";
import db from "../service/db/config.js";

const isAdmin = (req, res, next) => {
  // check if authorization header exists
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ error: "Authorization token is required!" });
  }

  // extract token from authorization header
  const token = authorization.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send({ error: "You are not logged in!" });
  }

  // verify JWT token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: "Invalid token" });
    }

    // get userId from JWT token
    const userId = decoded.userId;

    // find admin user in database
    const [result] = await pool.query(
      `SELECT * FROM ${db.usersTable} WHERE id = ? AND email = ? AND role = ?;`,
      [userId, process.env.ADMIN_EMAIL, "admin"]
    );
    const adminUser = result[0];

    // throw error if user doesn't exist in database
    if (!adminUser) {
      return res.status(404).send({ error: "Admin user not found!" });
    }

    // pass user data to req.user
    req.user = adminUser;

    // go next
    next();
  });
};

export default isAdmin;
