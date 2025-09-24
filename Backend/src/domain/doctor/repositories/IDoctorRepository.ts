import { IDoctor } from "../entities/IDoctor";
import { IDoctorListItem } from "../entities/IDoctorListItem";
import { IDoctorWithUser } from "../entities/IDoctorWithLogin";

export interface IDoctorRepository {
  createDoctor(
    data: Omit<IDoctor, "id" | "updatedAt" | "createdAt">
  ): Promise<IDoctor>;
  getDoctorById(id: string): Promise<IDoctorWithUser | null>;
  getDoctorByEmail(email: string): Promise<IDoctor | null>;
  getAllDoctors(
    page: number,
    limit: number,
    search:string
  ): Promise<{ doctors: IDoctorListItem[]; total: number }>;
}
