import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../../types/express/auth";

export const Authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN!) as JwtPayload;
    console.log("payload from the token:", payload);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
