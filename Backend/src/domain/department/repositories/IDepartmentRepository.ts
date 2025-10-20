import { DepartmentDTO } from "../../../application/department/dto/DepartmentDTO";
import { IDepartment } from "../enitity/IDepartment";

export interface IDepartmentRepository {
  findAllDepartments(): Promise<IDepartment[] | null>;
  findById(departmentId: string): Promise<IDepartment | null>;
  createDepartment(
    data: Omit<IDepartment, "id" | "createdAt" | "updatedAt">
  ): Promise<IDepartment | null>;
  updateDepartment(
    departmentId: string,
    entity: DepartmentDTO
  ): Promise<IDepartment | null>;
}
