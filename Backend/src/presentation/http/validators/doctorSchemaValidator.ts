import { z } from "zod";
import { Request, Response, NextFunction } from "express";


export const RegisterDoctorSchema = z.object({

  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
  // departmentId: z.string().min(1, "Department is required"),
  // territoryId: z.string().min(1, "Territory is required"),
  hospitalId: z.string().min(1, "Invalid hospital id"),
  registrationId: z.string().min(1, "Please insert valid registeration id"),
  opHours: z.string().min(3, "Please insert valid op hour"),
  licenseImageUrl: z
  .object({
    fieldname: z.string(),
    originalname: z.string(),
    mimetype: z.string(),
    buffer: z.unknown().optional(),
    size: z.number(),
  })
  .optional(),
  hasOwnClinic: z
    .union([z.string(), z.boolean()])
    .transform((val) => {
      if (typeof val === "boolean") return val;
      return val === "true";
    })
    .default(false)
});

export const validateRegisterDoctorSchema = (req: Request, res: Response, next: NextFunction) => {

  const body: unknown = req.body;

   const dataToValidate = {
    ...(body as Record<string, unknown>),
    licenseImageUrl: req.file, 
  }

  const result = RegisterDoctorSchema.safeParse(dataToValidate);

  if (!result.success) {
    return res.status(400).json({ message: "Validation failed", errors: result.error.issues });
  }
  req.body = result.data;
  next();


};
