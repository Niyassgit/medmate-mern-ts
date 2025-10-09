import { Request, Response, NextFunction } from "express";


export const parsePostField = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.ingredients && typeof req.body.ingredients === "string") {
      req.body.ingredients = JSON.parse(req.body.ingredients).filter(Boolean);
    }

    if (req.body.useCases && typeof req.body.useCases === "string") {
      req.body.useCases = JSON.parse(req.body.useCases).filter(Boolean);
    }
  } catch (err) {
    req.body.ingredients = [];
    req.body.useCases = [];
  }

  next();
};
