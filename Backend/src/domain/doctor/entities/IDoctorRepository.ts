import { IDoctor } from "./IDoctor";

export interface IDoctorRepository{
    createDoctor(data:Omit<IDoctor , "id"| "updatedAt" | "createdAt">):Promise<IDoctor>;
    getDoctorById(id:string):Promise<IDoctor | null>;
    getDoctorByEmail(email:string):Promise <IDoctor | null>;
}