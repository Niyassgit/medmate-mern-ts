import { DepartmentsListResponseDTO } from "../dto/DepartmentsListResponseDTO";

export interface IGetAllDepartmentsUseCase {
  execute(
    userId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<DepartmentsListResponseDTO | null>;
}
