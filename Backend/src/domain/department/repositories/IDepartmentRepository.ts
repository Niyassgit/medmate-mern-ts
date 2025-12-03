import { DepartmentDTO } from "../../../application/department/dto/DepartmentDTO";
import { IDepartment } from "../enitity/IDepartment";

export interface IDepartmentRepository {
  getAllDepartments(): Promise<IDepartment[]>;
  findAllDepartments(
    page: number,
    limit: number,
    search: string
  ): Promise<{ departments: IDepartment[]; total: number }>;
  findById(departmentId: string): Promise<IDepartment | null>;
  createDepartment(
    data: Omit<IDepartment, "id" | "createdAt" | "updatedAt">
  ): Promise<IDepartment | null>;
  updateDepartment(
    departmentId: string,
    entity: DepartmentDTO
  ): Promise<IDepartment | null>;
  getDepartmentName(depId: string): Promise<string | null>;
}
