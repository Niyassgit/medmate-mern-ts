export interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  institution: string;
  schedule: string;
  location: string;
  // age:string,
  image: string;
  connectionStatus:string | null;
  connectionInitiator:string | null;
}
