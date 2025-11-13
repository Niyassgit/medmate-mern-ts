import { z } from "zod";

export const DoctorRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
  departmentId: z.string().min(1, "Department is required"),
  territoryId: z.string().min(1, "Territory is required"),
  hospital: z.string().min(1, "Invalid hospital id"),
  registrationId: z.string().min(1, "Please insert valid registeration id"),
  opStartTime: z.string().nonempty("Select start time"),
  opEndTime: z.string().nonempty("Select end time"),
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
    .default(false),
});
