export interface DoctorNetworkCardDTO {
  id: string;
  name: string;
  department: string | null;
  hospitalName: string;
  profileImage?: string | null;
  institution: string | null;
  territory: string | null;
  speciality: string | null;
  schedule: string | null;
  connectionStatus: string | null;
  connectionInitiator: string | null;
}
