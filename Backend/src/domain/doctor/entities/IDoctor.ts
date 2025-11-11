import { IEducation } from "../../common/entities/IEducations";
import { ICertificate } from "../../common/entities/ICertificate";

export interface IDoctor {
  id: string;
  loginId: string | null;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  phone: string;
  departmentId: string | null;
  experienceYears?: number | null;
  hasOwnClinic?: boolean | null;
  doctorClass?: string | null;
  territoryId: string ;
  hospital: string;
  registrationId: string;
  licenseImageUrl: string | null;
   opStartTime?:string | null;
  opEndTime?:string | null;
  opSession?:string | null;
  dob?:Date | null;
  about?: string | null;

  educations?: IEducation[];
  certificates?: ICertificate[];
  departmentName?: string | null;
  territoryName?: string | null;
}
