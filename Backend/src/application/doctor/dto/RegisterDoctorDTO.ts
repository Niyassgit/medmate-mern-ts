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
  opHours: string | null;
  hasOwnClinic?: boolean | null;
  about?:string |null
}
