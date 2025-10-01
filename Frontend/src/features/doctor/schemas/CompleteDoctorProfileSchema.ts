import { z } from "zod";
import { EducationSchema } from "./EducationSchema";
import { CertificateSchema } from "./CertificateSchema";


export const CompleteDoctorProfileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  profileImage: z.string().nullable().optional(),
  departmentId: z.string().nullable().optional(),
  experienceYears: z.number().nullable().optional(),
  hasOwnClinic: z.boolean().nullable().optional(),
  doctorClass: z.string().nullable().optional(),
  territoryId: z.string().nullable().optional(),
  hospital: z.string().min(2, "Hospital is required"),
  registrationId: z.string().min(2, "Registration ID is required"),
  licenseImageUrl: z.string().nullable().optional(),
  opHours: z.string().nullable().optional(),
  about: z.string().nullable().optional(),
  educations: z.array(EducationSchema).optional(),
  certificates: z.array(CertificateSchema).optional(),
});


export type CompleteDoctorProfileDTO = z.infer<typeof CompleteDoctorProfileSchema>;
