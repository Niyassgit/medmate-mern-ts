import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IDepartmentRepository } from "../../../domain/department/repositories/IDepartmentRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { NotFoundError, UnautharizedError } from "../../errors";
import { DepartmentDTO } from "../dto/DepartmentDTO";
import { IEditDepartmentUseCase } from "../interfaces/IEditDepartmentUseCase";
import { DepartmentMapper } from "../mappers/DepartmentMapper";

export class EditDepartmentUseCase implements IEditDepartmentUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _departmentRepository: IDepartmentRepository
  ) {}
  async execute(
    departmentId: string,
    dto: DepartmentDTO,
    userId?: string
  ): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const department = await this._departmentRepository.findById(departmentId);
    if (!department) throw new NotFoundError(ErrorMessages.DEP_NOT_FOUND);
    const mapped=DepartmentMapper.toEntity(dto);
    const resp = await this._departmentRepository.updateDepartment(
      departmentId,
      mapped
    );
    if(!resp) throw new NotFoundError(ErrorMessages.DEP_NOT_FOUND);
    return SuccessMessages.Dep_UPDATED;
  }
}
