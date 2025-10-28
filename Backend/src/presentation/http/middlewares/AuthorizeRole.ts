import { Request, Response, NextFunction } from "express";
import { ErrorMessages } from "../../../shared/Messages";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";

export const AuthorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: ErrorMessages.UNAUTHORIZED });
    }
    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(HttpStatusCode.FORBIDDEN).json({ message: ErrorMessages.FORBIDDEN});
    }

    next();
  };
};
