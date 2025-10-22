import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IDepartmentRepository } from "../../../domain/department/repositories/IDepartmentRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, NotFoundError } from "../../errors";
import { DepartmentDTO } from "../dto/DepartmentDTO";
import { ICreateDepartmentUseCase } from "../interfaces/ICreateDepartmentUseCase";
import { DepartmentMapper } from "../../department/mappers/DepartmentMapper";

export class CreateDepartmentUseCase implements ICreateDepartmentUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _departmentRepository: IDepartmentRepository
  ) {}

  async execute(userId: string, dto: DepartmentDTO): Promise<string> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const formatted = DepartmentMapper.toEntity(dto);
    const response = await this._departmentRepository.createDepartment(
      formatted
    );
    if (!response) throw new BadRequestError(ErrorMessages.REGISTER_ERROR);
    return SuccessMessages.DEPARTMENT_SUCCESS;
  }
}
