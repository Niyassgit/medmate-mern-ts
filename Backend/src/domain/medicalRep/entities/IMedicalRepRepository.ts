import { IMedicalRep } from "./IMedicalRep";


 export interface IMedicalRepRepository {
     
    createMedicalRep(data:Omit<IMedicalRep,"id" | "createdAt" | "updatedAt">):Promise<IMedicalRep>;
    getMedicalRepById(id:string):Promise<IMedicalRep | null>;
    // getMedicalRepByLoginId(loginId:string):Promise<MedicalRep | null>;
    getMedicalRepByEmail(email:string):Promise<IMedicalRep | null>;
}