export interface DoctorListDTO {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  isBlocked: boolean | null;
  hospital: string;
  territory:string | null;
  createdAt: Date | null;
  loginId: string | null;
}
