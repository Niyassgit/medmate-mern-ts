import { EducationDTO } from "../../common/dto/EducationDTO";
import { CertificateDTO } from "../../common/dto/CertificateDTO";

export interface CompleteDoctorProfileDTO{
  name: string;
  phone: string;
  departmentId?: string | null;
  experienceYears?: number | null;
  hasOwnClinic?: boolean | null;
  doctorClass?: string | null;
  territoryId?: string | null;
  hospital: string;
  registrationId: string;
  licenseImageUrl: string | null;
  opHours?: string | null;

  about?: string | null;
  educations?: EducationDTO[];
  certificates?: CertificateDTO[];
}