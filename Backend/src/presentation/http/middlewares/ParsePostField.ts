import { Request, Response, NextFunction } from "express";
import { ParsePostBody } from "../../types/ParsePostBody";

export const parsePostField = (
  req: Request<unknown, unknown, ParsePostBody>,
  res: Response,
  next: NextFunction
) => {
  const parseStringArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];

    if (typeof value === "string") {
      try {
        const parsed:unknown = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item): item is string => typeof item === "string" && Boolean(item)
          );
        }
      } catch {
        return [];
      }
    }

    if (Array.isArray(value)) {
      return value.filter(
        (item): item is string => typeof item === "string" && Boolean(item)
      );
    }

    return [];
  };

  req.body.ingredients = parseStringArray(req.body.ingredients);
  req.body.useCases = parseStringArray(req.body.useCases);

  next();
};
