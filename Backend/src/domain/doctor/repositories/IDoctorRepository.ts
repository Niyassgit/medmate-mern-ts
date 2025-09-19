import { IDoctor } from "../entities/IDoctor";
import { IDoctorListItem } from "../entities/IDoctorListItem";

export interface IDoctorRepository {
  createDoctor(
    data: Omit<IDoctor, "id" | "updatedAt" | "createdAt">
  ): Promise<IDoctor>;
  getDoctorById(id: string): Promise<IDoctor | null>;
  getDoctorByEmail(email: string): Promise<IDoctor | null>;
  getAllDoctors(
    page: number,
    limit: number
  ): Promise<{ doctors: IDoctorListItem[]; total: number }>;
}
