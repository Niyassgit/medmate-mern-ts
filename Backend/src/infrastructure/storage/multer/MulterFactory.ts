import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, "../uploads");

    if (file.fieldname === "licenseImageUrl") {
      uploadPath = path.join(uploadPath, "licenses");
    } else if (file.fieldname === "companyLogoUrl") {
      uploadPath = path.join(uploadPath, "company-logo");
    } else {
      uploadPath = path.join(uploadPath, "others");
    }
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.fieldname === "licenseImageUrl") {
    if (
      ["image/jpeg", "image/png", "application/pdf"].includes(file.mimetype)
    ) {
      return cb(null, true);
    }
  }

  if (file.fieldname === "companyLogoUrl") {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) {
      return cb(null, true);
    }
  }
  return cb(new Error("Invalid file type!") as unknown as null, false);
};

export const upload = multer({ storage, fileFilter });
