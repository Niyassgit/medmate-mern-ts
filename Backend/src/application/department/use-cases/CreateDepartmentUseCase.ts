import { IDepartmentRepository } from "../../../domain/department/repositories/IDepartmentRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError } from "../../../domain/common/errors";
import { DepartmentDTO } from "../dto/DepartmentDTO";
import { ICreateDepartmentUseCase } from "../interfaces/ICreateDepartmentUseCase";
import { DepartmentMapper } from "../mappers/DepartmentMapper";
import { UnautharizedError } from "../../../domain/common/errors";

export class CreateDepartmentUseCase implements ICreateDepartmentUseCase {
  constructor(private _departmentRepository: IDepartmentRepository) {}

  async execute(dto: DepartmentDTO, userId?: string): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const departments = await this._departmentRepository.getAllDepartments();

    const existDepartment = departments.some(
      (d) => d.name.trim().toLowerCase() === dto.name.trim().toLowerCase()
    );

    if (existDepartment)
      throw new BadRequestError(ErrorMessages.DEPARTMENT_EXIST);

    const formatted = DepartmentMapper.toEntity(dto);

    const response = await this._departmentRepository.createDepartment(
      formatted
    );

    if (!response) throw new BadRequestError(ErrorMessages.REGISTER_ERROR);

    return SuccessMessages.DEPARTMENT_SUCCESS;
  }
}
