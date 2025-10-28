import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { IGetAllDepartmentOptionsUseCase } from "../../department/interfaces/IGetAllDepartmentOptionsUseCase";
import { TerritoryOptionsDTO } from "../dto/TerritoryOptionsDTO";
import { TerritoryMapper } from "../mappers/TerritoryMapper";

export class GetALLTerritoryOptionsUseCase
  implements IGetAllDepartmentOptionsUseCase
{
  constructor(private _territoryRepository: ITerritoryRepository) {}
  async execute(): Promise<TerritoryOptionsDTO[] | null> {
    const resp = await this._territoryRepository.getAllTerritories();
    if (!resp) return null;
    const mapped = TerritoryMapper.toDomainOptions(resp);
    return mapped ? mapped : null;
  }
}
