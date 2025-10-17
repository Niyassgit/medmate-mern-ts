import { DoctorsListResponseDTO } from "../dto/DocrtorsListResponseDTO";

export interface IGetAllDoctorsUseCase {
  execute(
    page: number,
    limit: number,
    search: string
  ): Promise<DoctorsListResponseDTO>;
}
