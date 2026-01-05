import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { TerritoryMapper } from "../../territory/mappers/TerritoryMapper";
import { TerritoryDetailsDTO } from "../dto/TerritoryDetailsDTO";
import { ITerritoryDetailsUseCase } from "../interfaces/ITerritoryDetailsUseCase";

export class TerritoryDetailsUseCase implements ITerritoryDetailsUseCase {
  constructor(private _territoryRepository: ITerritoryRepository) { }
  async execute(
    territoryId: string,
    page: number,
    limit: number
  ): Promise<TerritoryDetailsDTO> {
    const result = await this._territoryRepository.territoryUsers(
      territoryId,
      page,
      limit
    );
    return TerritoryMapper.toDomainTerritoryUsers(result);
  }
}
