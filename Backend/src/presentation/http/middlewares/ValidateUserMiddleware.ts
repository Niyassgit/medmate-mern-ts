import { Request, Response, NextFunction } from "express";
import { IUserValidationService } from "../../../domain/common/services/IUserValidationService";

export const makeValidateUserMiddleware = (
  validationService: IUserValidationService
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await validationService.validateUser(req.user.userId);
      next();
    } catch (error) {
      next(error);
    }
  };
};
