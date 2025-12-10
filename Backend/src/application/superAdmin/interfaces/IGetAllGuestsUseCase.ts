import { GuestsListResponseDTO } from "../dto/GuestsListResponseDTO";

export interface IGetAllGuestsUseCase {
  execute(
    page: number,
    limit: number,
    search: string,
    territory?: string
  ): Promise<GuestsListResponseDTO>;
}

