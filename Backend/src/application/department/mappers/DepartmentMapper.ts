import { IDepartment } from "../../../domain/department/enitity/IDepartment";
import { DepartmentDTO } from "../../superAdmin/dto/DepartmentDTO";
import { DepartmentListDTO } from "../../superAdmin/dto/DepartmentListDTO";
import { DepartmentOptionsDTO } from "../dto/DepartmentOptionsDTO";



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
            createdAt:entity.createdAt,
            isActive:entity.isActive
        }))
    }
    static toDomainOptions(entities:IDepartment[]):DepartmentOptionsDTO[]{
        return entities.map((dep)=>({
            id:dep.id,
            name:dep.name
        }))
    }

}