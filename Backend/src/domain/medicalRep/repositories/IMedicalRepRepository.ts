import { IMedicalRepWithUser } from "../entities/IMedicalRepWithUser";
import { IMedicalRep } from "../entities/IMedicalRep";
import { IRepListItem } from "../entities/IRepListItem";

export interface IMedicalRepRepository {
  createMedicalRep(
    data: Omit<IMedicalRep, "id" | "createdAt" | "updatedAt">
  ): Promise<IMedicalRep>;
  getMedicalRepById(id: string): Promise<IMedicalRepWithUser | null>;
  getMedicalRepByEmail(email: string): Promise<IMedicalRep | null>;
  getAllMedicalReps(
    page: number,
    limit: number,
    search:string,
  ): Promise<{ reps: IRepListItem[]; total: number }>;
  findMedicalRepIdByUserId(userId:string):Promise<string | null>;
  getMedicalRepByUserId(id:string):Promise<IMedicalRepWithUser | null>;
  completeProfile(userId:string,data:Partial<IMedicalRep>):Promise<IMedicalRep | null>;
  
}
