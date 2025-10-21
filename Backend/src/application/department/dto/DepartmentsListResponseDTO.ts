import { DepartmentListDTO } from "./DepartmentListDTO";

export interface DepartmentsListResponseDTO{
    departments:DepartmentListDTO[],
    total:number,
}