import jwt from "jsonwebtoken";
import pool from "../service/db/connection.js";
import db from "../service/db/config.js";

const isAuthorized = (req, res, next) => {
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

    // find user in database
    const [result] = await pool.query(
      `SELECT * FROM ${db.usersTable} WHERE id = ?;`,
      [userId]
    );
    const user = result[0];

    // throw error if user doesn't exist in database
    if (!user) {
      return res.status(404).send({ error: "User not found!" });
    }

    // pass user data to req.user
    req.user = user;

    // go next
    next();
  });
};

export default isAuthorized;
