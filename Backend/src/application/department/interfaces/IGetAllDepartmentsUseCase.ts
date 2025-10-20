import { DepartmentListDTO } from "../dto/DepartmentListDTO";

export interface IGetAllDepartmentsUseCase{
    execute(userId:string):Promise<DepartmentListDTO[] | null>
}