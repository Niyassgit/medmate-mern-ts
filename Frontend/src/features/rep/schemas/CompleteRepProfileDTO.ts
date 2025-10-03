import { z } from "zod";
import { EducationSchema } from "@/features/shared/schemas/EducationSchema";
import { CertificateSchema } from "@/features/shared/schemas/CertificateSchema";
export const CompleteRepProfileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  companyName: z.string().optional(),
  employeeId: z.string().optional(),
  about: z.string().optional(),
  companyLogoUrl: z.any(),
  educations: z.array(EducationSchema).optional(),
  certificates: z.array(CertificateSchema).optional(),
});

export type CompleteRepProfileDTO = z.infer<typeof CompleteRepProfileSchema>;
