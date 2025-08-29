import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const ValidateSchema =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res
          .status(400)
          .json({ message: "validation failed", errors: result.error.issues });
      }

      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
