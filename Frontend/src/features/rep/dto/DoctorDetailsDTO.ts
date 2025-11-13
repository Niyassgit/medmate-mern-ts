export interface EducationDTO {
  id: string;
  degree: string;
  institution: string;
  year?: number;
}

export interface CertificateDTO {
  id: string;
  name: string;
  issuedBy: string;
  issuedDate?: string;
}

export interface DoctorDetailsOnRepDTO {
  id: string;
  createdAt: Date;
  name: string;
  profileImage:string | null;
  phone: string;
  hasOwnClinic?: boolean | null;
  hospital: string;
  registrationId: string;
  opHours?: string | null;
  about?: string | null;
  connectionStatus: string | null;
  educations?: EducationDTO[];
  certificates?: CertificateDTO[];
  departmentName?: string | null;
  territoryName?: string | null;
}
