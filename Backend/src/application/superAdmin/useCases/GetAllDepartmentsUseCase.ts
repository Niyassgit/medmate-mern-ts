import { NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IDepartmentRepository } from "../../../domain/department/repositories/IDepartmentRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { DepartmentsListResponseDTO } from "../dto/DepartmentsListResponseDTO";
import { IGetAllDepartmentsUseCase } from "../../superAdmin/interfaces/IGetAllDepartmentsUseCase";
import { DepartmentMapper } from "../../department/mappers/DepartmentMapper";


export class GetAllDepartmentsUseCase implements IGetAllDepartmentsUseCase{
    constructor(
        private _userRepository:IUserRepository,
        private _departmentRepository:IDepartmentRepository
    ){}
    async execute(userId: string, page: number, limit: number, search: string): Promise<DepartmentsListResponseDTO | null> {
         const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        const {departments,total}=await this._departmentRepository.findAllDepartments(page,limit,search);
        if(!departments) throw new NotFoundError(ErrorMessages.DEP_NOT_FOUND);
        return {
           departments: DepartmentMapper.toDomainList(departments),
           total,
        }
    }
}