import { IPatient } from "../entities/IPatient";

export interface IPatientRepository{
    createPatient(data:Omit<IPatient, "id" | "createdAt" | "updatedAt">):Promise<IPatient>;
    findPatientById(patientId:string):Promise<IPatient | null>;
    updatePatient(patientId:string,data:Omit<IPatient,"id" | "createdAt">):Promise<IPatient>;
    findByEmailId(email:string):Promise<IPatient | null>;
} 