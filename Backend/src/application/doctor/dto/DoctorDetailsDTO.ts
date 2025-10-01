import { EducationDTO } from "./EducationDTO";
import { CertificateDTO } from "./CertificateDTO";

export interface DoctorDetailsDTO {
  id: string;
  name: string;
  email: string | null;
  isBlocked: boolean | null;
  phone: string;
  profileImage: string | null;

  departmentId?: string | null;
  experienceYears?: number | null;
  hasOwnClinic?: boolean | null;
  doctorClass?: string | null;
  territoryId?: string | null;
  hospital: string;
  registrationId: string;
  opHours?: string | null;
  about?: string | null;

  educations?: EducationDTO[];
  certificates?: CertificateDTO[];
}
