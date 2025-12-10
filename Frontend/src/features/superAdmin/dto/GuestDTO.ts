export interface GuestDTO{
     id: string;
     userId?: string | null;  
     doctorId?: string | null; 
     name: string;
     phone?: string;
     email?: string | null;   
     createdAt: Date;
}