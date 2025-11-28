import { BadRequestError } from "../../../domain/common/errors";
import { IDepartmentRepository } from "../../../domain/department/repositories/IDepartmentRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { NotFoundError, UnautharizedError } from "../../errors";
import { DepartmentDTO } from "../dto/DepartmentDTO";
import { IEditDepartmentUseCase } from "../interfaces/IEditDepartmentUseCase";
import { DepartmentMapper } from "../mappers/DepartmentMapper";

export class EditDepartmentUseCase implements IEditDepartmentUseCase {
  constructor(private _departmentRepository: IDepartmentRepository) {}

  async execute(
    departmentId: string,
    dto: DepartmentDTO,
    userId?: string
  ): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const department = await this._departmentRepository.findById(departmentId);
    if (!department) throw new NotFoundError(ErrorMessages.DEP_NOT_FOUND);

    const departments = await this._departmentRepository.getAllDepartments();
    if (departments) {
      const existDepartment = departments.some(
        (d) =>
          d.id !== departmentId &&
          d.name.trim().toLowerCase() === dto.name.trim().toLowerCase()
      );
      if (existDepartment)
        throw new BadRequestError(ErrorMessages.DEPARTMENT_EXIST);
    }

    const mapped = DepartmentMapper.toEntity(dto);
    const resp = await this._departmentRepository.updateDepartment(
      departmentId,
      mapped
    );

    if (!resp) throw new NotFoundError(ErrorMessages.DEP_NOT_FOUND);

    return SuccessMessages.Dep_UPDATED;
  }
}
