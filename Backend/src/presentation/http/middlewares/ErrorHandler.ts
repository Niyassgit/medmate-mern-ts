import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../domain/common/errors";
import { ErrorMessages } from "../../../shared/Messages";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";

export const ErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
  } else {
    console.error("🔥 Unhandled Error:", err);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ErrorMessages.SERVER_ERROR });
  }
};
