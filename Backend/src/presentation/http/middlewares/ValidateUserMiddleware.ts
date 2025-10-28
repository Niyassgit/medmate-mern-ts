import { Request, Response, NextFunction } from "express";
import { IUserValidationService } from "../../../domain/common/services/IUserValidationService";
import { ErrorMessages } from "../../../shared/Messages";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";

export const makeValidateUserMiddleware = (
  validationService: IUserValidationService
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: ErrorMessages.UNAUTHORIZED});
      }
      await validationService.validateUser(req.user.userId);
      next();
    } catch (error) {
      next(error);
    }
  };
};
