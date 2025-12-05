import { RepsListResponseDTO } from "../dto/RepsListResponseDTO";

export interface IGetAllRepsUseCase {
  execute(
    page: number,
    limit: number,
    search: string,
    territory?: string
  ): Promise<RepsListResponseDTO>;
}
