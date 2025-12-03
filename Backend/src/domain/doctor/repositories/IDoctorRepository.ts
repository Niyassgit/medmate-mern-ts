import { IDoctor } from "../entities/IDoctor";
import { IDoctorListItem } from "../entities/IDoctorListItem";
import { IDoctorWithUser } from "../entities/IDoctorWithUser";

export interface IDoctorRepository {
  createDoctor(
    data: Omit<IDoctor, "id" | "updatedAt" | "createdAt">
  ): Promise<IDoctor>;
  getDoctorById(id: string): Promise<IDoctorWithUser | null>;
  existById(id: string): Promise<boolean>;
  getDoctorIdByUserId(userId: string): Promise<{ doctorId: string | null }>;
  getDoctorByEmail(email: string): Promise<IDoctor | null>;
  getAllDoctors(
    page: number,
    limit: number,
    search: string
  ): Promise<{ doctors: IDoctorListItem[]; total: number }>;
  getDoctorByUserId(id: string): Promise<IDoctorWithUser | null>;
  updateDoctor(userId: string, data: Partial<IDoctor>): Promise<IDoctor | null>;
  findByTerritoryAndDepartment(
    departmentId: string | null,
    territories: string[] | null
  ): Promise<IDoctorWithUser[]>;
  getUserIdByDoctorId(doctorId: string): Promise<{ doctorUserId: string | null}>;
  getDoctorsForGuest():Promise<IDoctorWithUser[]>;
  countDoctors(startDate?: Date, endDate?: Date): Promise<number>;
}
