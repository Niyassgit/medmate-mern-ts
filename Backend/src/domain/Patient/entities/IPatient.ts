export interface IPatient {
  id: string;
  userId?: string | null;  
  doctorId?: string | null; 
  name: string;
  phone?: string;
  email?: string | null;   
  isRegistered: boolean;
  createdAt: Date;
  updatedAt: Date;
}