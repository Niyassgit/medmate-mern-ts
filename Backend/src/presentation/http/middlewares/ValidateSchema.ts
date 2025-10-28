import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";

export const ValidateSchema =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: result.error.issues[0].message,
        });
      }

      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
