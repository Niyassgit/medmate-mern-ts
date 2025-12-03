import { EducationDTO } from "@/features/shared/schemas/EducationSchema";
import { CertificateDTO } from "@/features/shared/schemas/CertificateSchema";
export interface MedicalRepDetailsDTO {
  id: string;
  email: string | null;
  isBlocked: boolean | null;
  name: string;
  phone: string;
  companyName: string;
  companyLogoUrl: string | null;
  employeeId: string | null;
  subscriptionStatus: boolean | null;
  maxConnectionsPerDay: number | null;
  profileImage: string | null;
  about: string | null;
  educations?: EducationDTO[];
  certificates?: CertificateDTO[];
  loginId: string;
  departmentName: string | null;
}
