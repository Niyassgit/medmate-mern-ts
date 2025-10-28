import { DepartmentDTO } from "../dto/DepartmentDTO";

export interface ICreateDepartmentUseCase{
    execute(userId:string,dto:DepartmentDTO):Promise<string>;
}