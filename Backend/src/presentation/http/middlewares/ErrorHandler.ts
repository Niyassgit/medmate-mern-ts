import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../domain/common/errors";
import { ErrorMessages } from "../../../shared/Messages";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";
import logger from "../../../infrastructure/logger/Logger";

export const ErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message}`);
    res.status(err.statusCode).json({ success: false, message: err.message });
  } else {
    const error=err as Error;
    logger.error(`🔥 Unhandled Error:${error.message}`);
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: ErrorMessages.SERVER_ERROR });
  }
};
