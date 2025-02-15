import bcrypt from "bcrypt";
import db from "../../models/index.js";
import { sendFinishAccountRegistrationEmail } from "../../helpers/email/emailHelper.js";
import validator from "email-validator";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../token/tokenService.js";

const { User } = db;

export const findOrCreateUser = async (authorizedUser, userInfo) => {
  // return if user authorized
  if (authorizedUser) return authorizedUser;

  // return if user already registered
  const existingUser = await User.findOne({ where: { email: userInfo.email } });
  if (existingUser) return existingUser;

  // create new user
  const hashedPassword = await bcrypt.hash(
    Math.random().toString(36).slice(2, 7),
    12
  );

  // send email registration confirmation
  const registrationToken = Math.random().toString(36).slice(2);

  try {
    await sendFinishAccountRegistrationEmail(userInfo.email, registrationToken);
  } catch (error) {
    console.log("Failed to send finish account registration email:", error);
  }

  return User.create({
    email: userInfo.email,
    password: hashedPassword,
    is_temp_password: true,
    role: "user",
    registered: false,
  });
};

export const createUser = async (email, password) => {
  if (!email || !password) {
    throw { status: 400, message: "Email and password are required!" };
  }

  // check if email is valid
  const isEmailValid = validator.validate(email);
  if (!isEmailValid) {
    throw { status: 400, message: "Input valid email!" };
  }

  // check if password is valid
  const isPasswordValid = password.length >= 6;
  if (!isPasswordValid) {
    throw {
      status: 400,
      message: "Password should be at least 6 characters long!",
    };
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // save user to database
  const newUser = await User.create({
    email,
    password: hashedPassword,
    isActivated: false,
    isGuest: false,
    role: 1,
  });

  return newUser;
};

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw { status: 400, message: "Email and password are required!" };
  }

  // check if email is valid
  const isEmailValid = validator.validate(email);
  if (!isEmailValid) {
    throw { status: 400, message: "Input valid email!" };
  }

  // find user in the database
  const user = await User.findOne({
    attributes: ["uuid", "email", "role", "password"],
    where: { email },
  });

  if (!user) {
    throw { status: 400, message: "User was not found!" };
  }

  // check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw { status: 400, message: "Invalid credentials!" };
  }

  // generate JWT token
  // const token = jwt.sign({ userUUId: user.uuid }, process.env.JWT_SECRET, {
  //   expiresIn: "1h",
  // });

  const accessToken = generateAccessToken(user.uuid);
  const refreshToken = generateRefreshToken(user.uuid);

  const [updatedUser] = await User.update(
    { refreshToken: refreshToken },
    { where: { uuid: user.uuid } }
  );

  return {
    accessToken,
    refreshToken,
    user: { uuid: user.uuid, email: user.email, role: user.role },
  };
};
