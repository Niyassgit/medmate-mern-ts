import { TerritoryDetailsDTO } from "../dto/TerritoryDetailsDTO";

export interface ITerritoryDetailsUseCase {
  execute(territoryId: string, page: number, limit: number): Promise<TerritoryDetailsDTO>;
}