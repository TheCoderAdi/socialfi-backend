import bcrypt from "bcrypt";
import prisma from "../config/prisma";

import { ErrorHandler, TryCatch } from "../utils/error";
import { sendToken } from "../utils/sendToken";
import { deleteFile } from "../utils/helper";

/**
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 */
export const register = TryCatch(async (req, res, next) => {
  const { username, email, password, bio } = req.body ?? {};

  if (!username || !email || !password || !bio) {
    deleteFile(req.file?.path as string);
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username,
      email,
    },
  });

  if (existingUser) {
    deleteFile(req.file?.path as string);
    return next(new ErrorHandler("User already exists", 400));
  }

  const password_hash = await bcrypt.hash(password, 10);

  let profile_picture_url = "";
  if (req.file) {
    profile_picture_url = req.file.filename;
  }

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password_hash,
      bio,
      profile_picture_url,
    },
  });

  sendToken({
    user,
    res,
    message: `You have successfully registered ${user.username}`,
    statusCode: 201,
  });
});

/**
 * @desc Login a user
 * @route POST /api/v1/auth/login
 */

export const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  sendToken({
    user,
    res,
    message: `You have successfully logged in ${user.username}`,
    statusCode: 200,
  });
});

/**
 * @desc Logout a user
 * @route GET /api/v1/auth/logout
 */

export const logout = TryCatch(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === "development" ? false : true,
    httpOnly: process.env.NODE_ENV === "development" ? false : true,
    sameSite: process.env.NODE_ENV === "development" ? false : "none",
  });

  return res.status(200).json({
    success: true,
    message: "You have successfully logged out",
  });
});
