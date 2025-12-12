import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";

export const ValidateSchema =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Preserve existingImages and other non-schema fields before validation
      const existingImages = (req.body as { existingImages?: string[] }).existingImages;
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: result.error.issues[0].message,
        });
      }

      req.body = result.data;
      
      // Restore existingImages after validation (it's not in the schema but needed by controller)
      if (existingImages) {
        (req.body as { existingImages?: string[] }).existingImages = existingImages;
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
