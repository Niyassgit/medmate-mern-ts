import { Role } from "../../../shared/Enums";

export interface CreateGuestDTO{
  userId?: string;  
  doctorId?: string; 
  territoryId?: string;
  name: string;
  phone: string;
  email: string; 
  password?:string;
  role:Role;
    
  isRegistered: boolean;
}