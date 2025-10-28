import { DepartmentDTO } from "../dto/DepartmentDTO";

export interface IEditDepartmentUseCase{
    execute(departmentId:string,dto:DepartmentDTO,userId?:string):Promise<string>;
}