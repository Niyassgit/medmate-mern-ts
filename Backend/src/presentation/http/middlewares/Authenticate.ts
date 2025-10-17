import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../types/auth";
import { ErrorMessages } from "../../../shared/Messages";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";

export const Authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: ErrorMessages.TOKEN_NOT_FOUND});

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN!) as JwtPayload;
    req.user = payload;
    next();
  } catch (error: unknown) {
    return res.status(HttpStatusCode.FORBIDDEN).json({ message: ErrorMessages.INVALID_TOKEN });
  }
};
