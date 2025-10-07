import { NextFunction, Request, Response } from "express";
import { EducationDTO } from "../validators/EducationSchema";
import { CertificateDTO } from "../validators/CertificateSchema";

interface ParseStringToArray {
  educations?: EducationDTO[] | string;
  certificates?: CertificateDTO[] | string;
}

export const parseArrayFields = (
  req: Request<unknown, unknown, ParseStringToArray>,
  res: Response,
  next: NextFunction
) => {
  if (typeof req.body.educations === "string") {
    try {
      req.body.educations = JSON.parse(req.body.educations) as EducationDTO[];
    } catch {
      return res.status(400).json({ message: "Invalid educations format" });
    }
  }

  if (typeof req.body.certificates === "string") {
    try {
      req.body.certificates = JSON.parse(
        req.body.certificates
      ) as CertificateDTO[];
    } catch {
      return res.status(400).json({ message: "Invalid certificates format" });
    }
  }
  next();
};
