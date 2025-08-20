import { SuperAdmin } from "./SuperAdmin";


export interface ISuperAdminRepository{
     createSuperAdmin(data:Omit<SuperAdmin, "id" | "createdAt" | "updatedAt">):Promise<SuperAdmin>;
     getSuperAdminByEmail(email:string):Promise<SuperAdmin | null>;
}