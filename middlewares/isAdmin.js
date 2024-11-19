import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { User } = db;

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

    // get userUUId from JWT token
    const userUUId = decoded.userUUId;

    // find user in database
    const user = await User.findOne({
      where: { uuid: userUUId },
    });

    // throw error if user role is not admin
    const isUserAdmin = user.role === "admin";
    if (!isUserAdmin) {
      return res.status(404).send({ error: "Admin user not found!" });
    }

    // pass user data to req.user
    req.user = user;

    // go next
    next();
  });
};

export default isAdmin;
