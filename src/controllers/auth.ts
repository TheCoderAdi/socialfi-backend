import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

import { ErrorHandler, TryCatch } from "../utils/error";
import { sendToken } from "../utils/sendToken";
import { deleteFile, generateUsername } from "../utils/helper";
import { saveAndEncryptFile } from "../utils/encrypt-decrypt";

/**
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 */
export const register = TryCatch(async (req, res, next) => {
  const {
    username,
    name,
    email,
    password,
    bio,
    gender,
    date_of_birth,
    interests,
    geo_location,
    hometown,
  } = req.body ?? {};

  if (
    !name ||
    !email ||
    !password ||
    !bio ||
    !gender ||
    !date_of_birth ||
    !interests ||
    !geo_location ||
    !hometown
  ) {
    (req.files as Express.Multer.File[])?.forEach((file) => deleteFile(file.path));
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  let randomUsername = "";
  if (!username) {
    randomUsername = generateUsername(name);
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    (req.files as Express.Multer.File[])?.forEach((file) => deleteFile(file.path));
    return next(new ErrorHandler("User already exists", 400));
  }

  const password_hash = await bcrypt.hash(password, 10);

  const files = req.files as Express.Multer.File[];

  let encryptedFiles: string[] = [];

  for (const file of files) {
    const fileStream = fs.createReadStream(file.path);
    const encryptedPath = await saveAndEncryptFile(fileStream, file.filename);
    encryptedFiles.push(path.basename(encryptedPath));

    fs.unlinkSync(file.path);
  }

  let profile_picture_url = encryptedFiles[0] || "";
  let photos = encryptedFiles.slice(1);
  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      username: username || randomUsername,
      name,
      email,
      password_hash,
      bio,
      profile_picture_url,
      gender,
      date_of_birth: new Date(date_of_birth),
      interests: Array.isArray(interests)
        ? interests
        : interests.split(",").map((i: string) => i.trim()),
      geo_location,
      hometown,
      photos,
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

export const logout = TryCatch(async (req, res) => {
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
