import { z } from "zod";
import { EducationSchema } from "./EducationSchema";
import { CertificateSchema } from "./CertificateSchema";

export const DoctorProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .regex(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces"),

  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone cannot exceed 15 digits")
    .regex(/^[0-9]+$/, "Phone must contain only numbers"),

  profileImage: z.string().url().nullable().optional(),

  departmentId: z.string().min(1, "Department is required"),

  experienceYears: z
    .number()
    .int("Experience must be a whole number")
    .min(0, "Experience cannot be negative")
    .max(100, "Experience is too high")
    .nullable()
    .optional(),

  hasOwnClinic: z.boolean().nullable().optional(),
  dob: z
    .string()
    .nonempty("Date of birth is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .optional(),

  doctorClass: z
    .string()
    .min(1, "Doctor class is required")
    .nullable()
    .optional(),

  territoryId: z.string().min(1, "Department is required"),

  hospital: z
    .string()
    .min(2, "Hospital is required")
    .regex(
      /^[A-Za-z\s]+$/,
      "Hospital name must contain only letters and spaces"
    ),

  registrationId: z
    .string()
    .min(2, "Registration ID is required")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "Registration ID can contain letters, numbers, and hyphens"
    ),

  licenseImageUrl: z.string().url().nullable().optional(),

  opStartTime: z.string().nonempty("Select start time"),
  opEndTime: z.string().nonempty("Select end time"),

  about: z
    .string()
    .min(10, "About section should be at least 10 characters")
    .nullable()
    .optional(),

  educations: z.array(EducationSchema).optional(),

  certificates: z.array(CertificateSchema).optional(),
});

export type DoctorProfileUpdateRepProfileDTO = z.infer<
  typeof DoctorProfileUpdateSchema
>;
