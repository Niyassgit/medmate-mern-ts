export interface DoctorCardDTO {
  id: string;
  name: string;
  department: string;
  hospitalName: string;
  profileImage: string;
  institution: string;
  territory: string;
  specialty: string;
  schedule: string;
  connectionStatus: string | null;
  connectionInitiator: string | null;
}
