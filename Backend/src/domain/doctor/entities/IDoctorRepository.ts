import {Doctor} from "./entities/Doctor";

export interface IDoctorRepository{
    createDoctor(data:Omit<Doctor , "id"| "updatedAt" | "createdAt">):Promise<Doctor>;
    getDoctorById(id:string):Promise<Doctor | null>;
    getDoctorByEmail(email:string):Promise <Doctor | null>;
}