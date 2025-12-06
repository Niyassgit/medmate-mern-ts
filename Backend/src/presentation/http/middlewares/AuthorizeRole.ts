import { Request, Response, NextFunction } from "express";
import { ErrorMessages } from "../../../shared/Messages";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";
import { JwtPayload } from "../../types/auth";

export const AuthorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    if (!user) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ message: ErrorMessages.UNAUTHORIZED });
    }
    if (!roles.includes(user.role)) {
      return res
        .status(HttpStatusCode.FORBIDDEN)
        .json({ message: ErrorMessages.FORBIDDEN });
    }

    next();
  };
};
