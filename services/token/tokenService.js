import jwt from "jsonwebtoken";

export const generateAccessToken = (userUUID) => {
  return jwt.sign({ userUUID: userUUID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
  });
};

export const generateRefreshToken = (userUUID) => {
   return jwt.sign({ userUUID: userUUID }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
  });
};
