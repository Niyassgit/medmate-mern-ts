import { NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IDepartmentRepository } from "../../../domain/department/repositories/IDepartmentRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { DepartmentListDTO } from "../dto/DepartmentListDTO";
import { IGetAllDepartmentsUseCase } from "../interfaces/IGetAllDepartmentsUseCase";
import { DepartmentMapper } from "../mappers/DepartmentMapper";


export class GetAllDepartmentsUseCase implements IGetAllDepartmentsUseCase{
    constructor(
        private _userRepository:IUserRepository,
        private _departmentRepository:IDepartmentRepository
    ){}
    async execute(userId: string): Promise<DepartmentListDTO[] | null> {
        const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        const response=await this._departmentRepository.findAllDepartments( );
        if(!response) throw new NotFoundError(ErrorMessages.DEP_NOT_FOUND);
        return DepartmentMapper.toDomainList(response);
    }
}