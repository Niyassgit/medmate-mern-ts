import { IDepartmentRepository } from "../../domain/department/repositories/IDepartmentRepository";
import { BaseRepository } from "../database/BaseRepository";
import { IDepartment } from "../../domain/department/enitity/IDepartment";
import { Department, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import { DepartmentMapper } from "../mappers/DepartmentMapper";
import { DepartmentDTO } from "../../application/department/dto/DepartmentDTO";

export class DepartmentRepository
  extends BaseRepository<
    IDepartment,
    Department,
    Prisma.DepartmentCreateInput,
    "department"
  >
  implements IDepartmentRepository
{
  constructor() {
    super(prisma.department, (department) =>
      DepartmentMapper.toDomain(department)
    );
  }

  async createDepartment(
    data: Omit<IDepartment, "id" | "createdAt" | "updatedAt">
  ): Promise<IDepartment | null> {
    const response = await this.create(data);
    return response ? response : null;
  }
  async findAllDepartments(): Promise<IDepartment[] | null> {
    const resp = await this.model.findMany({
      orderBy: { createdAt: "desc" },
    });
    return resp ? resp : null;
  }
  async updateDepartment(
    departmentId: string,
    entity: DepartmentDTO
  ): Promise<IDepartment | null> {
    const response = await this.update(departmentId, entity);
    return response;
  }
}
