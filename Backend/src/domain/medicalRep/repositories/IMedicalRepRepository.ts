import { IMedicalRep } from "../entities/IMedicalRep";
import { IRepListItem } from "../entities/IRepListItem";

 export interface IMedicalRepRepository {
     
    createMedicalRep(data:Omit<IMedicalRep,"id" | "createdAt" | "updatedAt">):Promise<IMedicalRep>;
    getMedicalRepById(id:string):Promise<IMedicalRep | null>;
    getMedicalRepByEmail(email:string):Promise<IMedicalRep | null>;
    getAllMedicalReps(page:number,limit:number):Promise<{reps:IRepListItem[],total:number}>;
}