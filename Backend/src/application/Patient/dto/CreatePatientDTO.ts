import { Role } from "../../../shared/Enums";

export interface CreatePatientDTO{
  userId?: string;  
  doctorId?: string; 
  name: string;
  phone: string;
  email: string; 
  password?:string;
  role:Role;
    
  isRegistered: boolean;
}