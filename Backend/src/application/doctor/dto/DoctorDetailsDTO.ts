import { EducationDTO } from "../../common/dto/EducationDTO";
import { CertificateDTO } from "../../common/dto/CertificateDTO";

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
  licenseImageUrl?: string | null;

  educations?: EducationDTO[];
  certificates?: CertificateDTO[];
}
