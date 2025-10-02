import { EducationDTO } from "../../common/dto/EducationDTO";
import { CertificateDTO } from "../../common/dto/CertificateDTO";

export interface CompleteRepProfileDTO {
  name: string;
  phone: string;
  profileImage: string | null;
  companyName: string;
  companyLogoUrl?: string | null;
  employeeId?: string | null;
  departmentId?: string | null;
  about?: string | null;

  educations?: EducationDTO[];
  certificates?: CertificateDTO[];
}
