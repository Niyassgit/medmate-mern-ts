import { UnautharizedError } from "../../../domain/common/errors";
import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { TerritoryMapper } from "../../territory/mappers/TerritoryMapper";
import { TerritoryDetailsDTO } from "../dto/TerritoryDetailsDTO";
import { ITerritoryDetailsUseCase } from "../interfaces/ITerritoryDetailsUseCase";

export class TerritoryDetailsUseCase implements ITerritoryDetailsUseCase {
  constructor(private _territoryRepository: ITerritoryRepository) {}
  async execute(territoryId: string): Promise<TerritoryDetailsDTO> {
    const result = await this._territoryRepository.territoryUsers(territoryId);
    return TerritoryMapper.toDomainTerritoryUsers(result);
  }
}
