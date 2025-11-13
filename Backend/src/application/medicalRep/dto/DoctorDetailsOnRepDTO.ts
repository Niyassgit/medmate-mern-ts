import { EducationDTO } from "../../../presentation/http/validators/EducationSchema";
import { CertificateDTO } from "../../../presentation/http/validators/CertificateSchema";

export interface DoctorDetailsOnRepDTO {
  id: string;
  createdAt: Date;
  name: string;
  phone: string;
  hasOwnClinic?: boolean | null;
  hospital: string;
  registrationId: string;
  opHours?: string | null;
  about?: string | null;
  connectionStatus:string | null;

  educations?: EducationDTO[];
  certificates?: CertificateDTO[];
  departmentName?: string | null;
  territoryName?: string | null;
}
