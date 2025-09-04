export interface DoctorListDTO{
  id: string;
  name: string;
  email: string | null;
  phone: string;
  isBlocked: boolean | null;
  hospital: string;
  createdAt: Date | null;
}