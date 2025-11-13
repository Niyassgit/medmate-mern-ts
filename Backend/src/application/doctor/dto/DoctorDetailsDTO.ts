import { EducationDTO } from "../../common/dto/EducationDTO";
import { CertificateDTO } from "../../common/dto/CertificateDTO";

export interface DoctorDetailsDTO {
  id: string;
  name: string;
  email: string | null;
  isBlocked: boolean | null;
  phone: string;
  profileImage: string | null;

  departmentName: string | null;
  experienceYears?: number | null;
  hasOwnClinic?: boolean | null;
  doctorClass?: string | null;
  territoryName: string | null;
  hospital: string;
  registrationId: string;
  opHours?: string | null;
  about?: string | null;
  licenseImageUrl?: string | null;
  dob?:string | null;

  educations?: EducationDTO[];
  certificates?: CertificateDTO[];
}
