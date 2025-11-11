export interface RegisterDoctorDTO {
  name: string;
  email: string;
  password?: string;
  phone: string;
  departmentId?: string | null;
  territoryId?: string | null;
  hospital: string;
  registrationId: string;
  licenseImageUrl: string | null;
  opStartTime?: string;
  opEndTime?: string; 
  hasOwnClinic?: boolean | null;
  about?: string | null;
}
