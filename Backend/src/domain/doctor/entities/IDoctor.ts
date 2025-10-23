import { IEducation } from "../../common/entities/IEducations";
import { ICertificate } from "../../common/entities/ICertificate";

export interface IDoctor {
  id: string;
  loginId: string | null;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  phone: string;
  departmentId: string;
  experienceYears?: number | null;
  hasOwnClinic?: boolean | null;
  doctorClass?: string | null;
  territoryId: string;
  hospital: string;
  registrationId: string;
  licenseImageUrl: string | null;
  opHours?: string | null;

  about?: string | null;

  educations?: IEducation[];
  certificates?: ICertificate[];
  departmentName?: string | null;
  territoryName?: string | null;
}
