export interface Doctor {
  id: string;
  loginId:string|null;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  phone:string;
  departmentId?: string | null; 
  experienceYears?: number | null;
  hasOwnClinic?: boolean | null;
  doctorClass?: string | null;
  territoryId?: string | null;
  hospitalId: string;           
  registrationId: string;       
  licenseImageUrl: File;  
  opHours?: string | null;

  about?: string | null;
  educations?: string[];
  certificates?: string[];
}
