import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/error";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../config/prisma";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  req.user = user;

  next();
};
