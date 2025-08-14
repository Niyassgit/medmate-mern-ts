import { MedicalRep } from "./medicalRep";


 export interface IMedicalRepRepository {
     
    createMedicalRep(data:Omit<MedicalRep,"id" | "createdAt" | "updatedAt">):Promise<MedicalRep>;
    getMedicalRepById(id:string):Promise<MedicalRep | null>;
    // getMedicalRepByLoginId(loginId:string):Promise<MedicalRep | null>;
    getMedicalRepByEmail(email:string):Promise<MedicalRep | null>;
}