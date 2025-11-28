import { DepartmentDTO } from "../dto/DepartmentDTO";

export interface ICreateDepartmentUseCase{
    execute(dto:DepartmentDTO,userId?:string,):Promise<string>;
}