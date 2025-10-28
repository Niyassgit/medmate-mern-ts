import { IDepartmentRepository } from "../../../domain/department/repositories/IDepartmentRepository";
import { DepartmentOptionsDTO } from "../dto/DepartmentOptionsDTO";
import { IGetAllDepartmentOptionsUseCase } from "../interfaces/IGetAllDepartmentOptionsUseCase";
import { DepartmentMapper } from "../mappers/DepartmentMapper";


export class GetAllDepartmentOptionsUseCase implements IGetAllDepartmentOptionsUseCase{
    constructor(
        private _departmentRepository:IDepartmentRepository
    ){}
    async execute(): Promise<DepartmentOptionsDTO[] | null> {
        const departments=await this._departmentRepository.getAllDepartments();
        if(!departments) return null;
        const mapped=DepartmentMapper.toDomainOptions(departments);
        return mapped;
    }
}