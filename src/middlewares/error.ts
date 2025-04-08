import { Prisma } from "@prisma/client";
import { AppError } from "../types/types";
import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      //TODO: Fix this type error
      //@ts-expect-error: 'meta.target' may be undefined or not of the expected type
      const target = err.meta?.target?.join(", ");
      err.message = `Duplicate field(s): ${target}`;
      err.statusCode = 400;
    }

    if (err.code === "P2003") {
      err.message = "Foreign key constraint failed";
      err.statusCode = 400;
    }

    if (err.code === "P2025") {
      err.message = "Record not found";
      err.statusCode = 404;
    }
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
