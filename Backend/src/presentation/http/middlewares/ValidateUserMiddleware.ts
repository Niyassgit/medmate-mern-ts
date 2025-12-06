import { Request, Response, NextFunction } from "express";
import { IUserValidationService } from "../../../domain/common/services/IUserValidationService";
import { ErrorMessages } from "../../../shared/Messages";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";
import { GetOptionalUserId } from "../utils/GetOptionalUserId";

export const makeValidateUserMiddleware = (
  validationService: IUserValidationService
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId=GetOptionalUserId(req.user);
    if (!userId) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: ErrorMessages.UNAUTHORIZED});
      }
      await validationService.validateUser(userId);
      next();
    } catch (error) {
      next(error);
    }
  };
};
