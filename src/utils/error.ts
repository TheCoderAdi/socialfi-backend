import { Request, Response, NextFunction } from "express";
import { ControllerType } from "../types/types";

class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const TryCatch =
  (passedFunc: ControllerType) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await passedFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export { ErrorHandler, TryCatch };
