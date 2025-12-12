export interface IGuest {
  id: string;
  userId?: string | null;  
  doctorId?: string | null; 
  territoryId?: string | null;
  name: string;
  phone?: string;
  email?: string | null;   
  isRegistered: boolean;
  createdAt: Date;
  updatedAt: Date;
}