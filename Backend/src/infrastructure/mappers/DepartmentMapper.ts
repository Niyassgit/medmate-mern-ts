import { Department, Prisma } from "@prisma/client";
import { IDepartment } from "../../domain/department/enitity/IDepartment";

export class DepartmentMapper{
    static toPersistance(entity:IDepartment):Prisma.DepartmentCreateInput{
        return{
            name:entity.name,
            isActive:entity.isActive
        }

    }
    static toDomain(persistane:Department):IDepartment{
        return {
            id:persistane.id,
            name:persistane.name,
            createdAt:persistane.createdAt,
            isActive:persistane.isActive,
            updatedAt:persistane.updatedAt
        }
    }
    static toListDepartments(persistane:Department[]):IDepartment[]{
        return persistane.map((dep)=>({
            id:dep.id,
            name:dep.name,
            isActive:dep.isActive,
            createdAt:dep.createdAt,
            updatedAt:dep.updatedAt
        }))
    }
}