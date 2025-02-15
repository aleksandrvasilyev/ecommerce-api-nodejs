import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { User } = db;
const isAuthorizedOptional = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return next();

  try {
    const { userUUId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = await User.findOne({
      where: { uuid: userUUId },
      // attributes: ['uuid', 'id']
    });

    next();
  } catch {
    return next();
  }
};

export default isAuthorizedOptional;
