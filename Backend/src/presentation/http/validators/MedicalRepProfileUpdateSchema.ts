import { z } from "zod";
import { EducationSchema } from "./EducationSchema";
import { CertificateSchema } from "./CertificateSchema";

export const MedicalRepProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .regex(/^[A-Za-z\s]+$/, "Name must contain only letters"),
  phone: z
    .string()
    .min(10, "Phone number is required")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  companyName: z.string().optional(),
  employeeId: z.string().optional(),
  about: z.string().optional(),
  companyLogoUrl: z.any(),
  educations: z.array(EducationSchema).optional(),
  certificates: z.array(CertificateSchema).optional(),
});

export type CompleteRepProfileDTO = z.infer<typeof MedicalRepProfileUpdateSchema>;
