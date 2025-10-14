import { Request, Response, NextFunction } from "express";
import { ParsePostBody } from "../../types/ParsePostBody";

export const parsePostField = (
  req: Request<unknown, unknown, ParsePostBody>,
  res: Response,
  next: NextFunction
) => {
  const parseStringArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value
        .map(item => {
          if (typeof item === 'string') {
            if (item.startsWith('[') || item.startsWith('{')) {
              try {
                const parsed: unknown = JSON.parse(item);
                if (Array.isArray(parsed)) {
                  return parsed.filter((p): p is string => typeof p === 'string');
                }
                return item;
              } catch {
                return item;
              }
            }
            return item;
          }
          return item;
        })
        .flat(Infinity) 
        .filter((item): item is string => 
          typeof item === 'string' && 
          Boolean(item) && 
          item.trim() !== ''
        );
    }

    if (typeof value === 'string') {
      try {
        const parsed: unknown = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parseStringArray(parsed as string | string[]);
        }
      } catch {
        return [value].filter(Boolean);
      }
    }

    return [];
  };

  req.body.ingredients = parseStringArray(req.body.ingredients);
  req.body.useCases = parseStringArray(req.body.useCases);
  req.body.existingImages = parseStringArray(req.body.existingImages);
  next();
};