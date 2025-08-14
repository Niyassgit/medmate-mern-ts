export interface Doctor {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  phone:string;
  password: string;
  departmentId?: string | null; 
  experienceYears?: number | null;
  hasOwnClinic?: boolean | null;
  doctorClass?: string | null;
  territoryId?: string | null;
  hospitalId: string;           
  registrationId: string;       
  licenseImageUrl: string;  
  opHours?: string | null;
  about?: string | null;
  educations: string[];
  certificates: string[];
}
