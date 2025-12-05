import { CertificateDTO } from "../../../presentation/http/validators/CertificateSchema";
import { EducationDTO } from "../../../presentation/http/validators/EducationSchema";

export interface MedicalRepDetailsOnDoctorDTO {
  id: string;
  email: string | null;
  name: string;
  phone: string;
  companyName: string;
  companyLogoUrl: string | null;
  employeeId: string | null;
  profileImage: string | null;
  about: string | null;
  educations?: EducationDTO[];
  certificates?: CertificateDTO[];
  loginId: string | null;
  connectionStatus: string | null;
  connectionInitiator: string | null;
}
