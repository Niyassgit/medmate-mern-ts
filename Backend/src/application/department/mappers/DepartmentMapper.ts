import { IDepartment } from "../../../domain/department/enitity/IDepartment";
import { DepartmentDTO } from "../dto/DepartmentDTO";
import { DepartmentListDTO } from "../dto/DepartmentListDTO";



export class DepartmentMapper{
    static toEntity(dto:DepartmentDTO):Omit<IDepartment, "id"|"createdAt"|"updatedAt">{
        return{
            name:dto.name,
            isActive:dto.isActive
        }
    }
    static toDomainList(entities:IDepartment[]):DepartmentListDTO[]{
        return entities.map((entity)=>({
            id:entity.id,
            name:entity.name,
            createAt:entity.createdAt,
            isActive:entity.isActive
        }))
    }
}