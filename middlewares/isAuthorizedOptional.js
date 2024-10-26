import jwt from "jsonwebtoken";
import pool from "../service/db/connection.js";
import db from "../service/db/config.js";

const isAuthorizedOptional = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const [result] = await pool.query(
      `SELECT * FROM ${db.usersTable} WHERE id = ?;`,
      [userId]
    );
    const user = result[0];

    if (!user) {
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    return next();
  }
};

export default isAuthorizedOptional;
