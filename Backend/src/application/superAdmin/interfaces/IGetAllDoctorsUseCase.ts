import { DoctorsListResponseDTO } from "../dto/DocrtorsListResponseDTO";

export interface IGetAllDoctorsUseCase {
  execute(
    page: number,
    limit: number,
    search: string,
    territory?: string
  ): Promise<DoctorsListResponseDTO>;
}
