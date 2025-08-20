import { MedicalRep } from "./MedicalRep";


 export interface IMedicalRepRepository {
     
    createMedicalRep(data:Omit<MedicalRep,"id" | "createdAt" | "updatedAt">):Promise<MedicalRep>;
    getMedicalRepById(id:string):Promise<MedicalRep | null>;
    // getMedicalRepByLoginId(loginId:string):Promise<MedicalRep | null>;
    getMedicalRepByEmail(email:string):Promise<MedicalRep | null>;
}