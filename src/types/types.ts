import { Prisma, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export interface SendToken {
  user: User;
  res: Response;
  message: string;
  statusCode: number;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<void | Response<any, Record<string, any>>>;

export interface CustomError extends Error {
  statusCode?: number;
}

export interface PrismaError extends Prisma.PrismaClientKnownRequestError {
  statusCode?: number;
}

export type AppError = CustomError | PrismaError;
