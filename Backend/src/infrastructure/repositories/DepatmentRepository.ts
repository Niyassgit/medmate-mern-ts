import { IDepartmentRepository } from "../../domain/department/repositories/IDepartmentRepository";
import { BaseRepository } from "../database/BaseRepository";
import { IDepartment } from "../../domain/department/enitity/IDepartment";
import { Department, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import { DepartmentMapper } from "../mappers/DepartmentMapper";
import { DepartmentDTO } from "../../application/superAdmin/dto/DepartmentDTO";

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
 async findAllDepartments(page: number, limit: number, search: string): Promise<{departments:IDepartment[];total:number}> {
  const skip=(page-1)*limit;
  const where:Prisma.DepartmentWhereInput=search?{
    OR:[
      {name:{contains:search,mode:"insensitive"}}
    ]
  }:{};
  const [departments,total]=await Promise.all([
    prisma.department.findMany({
      where,
      orderBy:{createdAt:"desc"},
      skip,
      take:limit,
    }),
    prisma.department.count({where}),
  ])

    return {
      departments:DepartmentMapper.toListDepartments(departments),
      total,
    }
 }
  async updateDepartment(
    departmentId: string,
    entity: DepartmentDTO
  ): Promise<IDepartment | null> {
    const response = await this.update(departmentId, entity);
    return response;
  }
  async getAllDepartments(): Promise<IDepartment[] | null> {
    return await this.findAll();
  }
}
