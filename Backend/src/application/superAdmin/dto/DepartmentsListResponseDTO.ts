import { DepartmentListDTO } from "../../superAdmin/dto/DepartmentListDTO";

export interface DepartmentsListResponseDTO{
    departments:DepartmentListDTO[],
    total:number,
}