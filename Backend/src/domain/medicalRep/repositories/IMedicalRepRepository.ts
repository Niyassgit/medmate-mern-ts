import { IMedicalRepWithUser } from "../entities/IMedicalRepWithUser";
import { IMedicalRep } from "../entities/IMedicalRep";
import { IRepListItem } from "../entities/IRepListItem";

export interface IMedicalRepRepository {
  createMedicalRep(
    data: Omit<IMedicalRep, "id" | "createdAt" | "updatedAt">
  ): Promise<IMedicalRep>;
  existById(id: string): Promise<boolean>;
  getRepIdByUserId(userId: string): Promise<{ repId: string | null }>;
  getMedicalRepById(id: string): Promise<IMedicalRepWithUser | null>;
  getMedicalRepByEmail(email: string): Promise<IMedicalRep | null>;
  getAllMedicalReps(
    page: number,
    limit: number,
    search: string,
    territory?: string
  ): Promise<{ reps: IRepListItem[]; total: number }>;
  findMedicalRepIdByUserId(userId: string): Promise<string | null>;
  getMedicalRepByUserId(id: string): Promise<IMedicalRepWithUser | null>;
  completeProfile(
    userId: string,
    data: Partial<IMedicalRep>
  ): Promise<IMedicalRep | null>;
  findByTerritoryAndDepartment(
    territoryId: string | null,
    departmentId: string | null
  ): Promise<IMedicalRepWithUser[]>;
  findByDepartment(departmentId: string): Promise<IMedicalRepWithUser[]>;
  getUserIdByRepId(repId: string): Promise<{ repUserId: string | null }>;
  countReps(startDate?: Date, endDate?: Date): Promise<number>;
  getMonthlyRepGrowth(year: number): Promise<{ month: number; count: number }[]>;
  findByIds(repIds:string[]):Promise<IMedicalRep[]>;
}
