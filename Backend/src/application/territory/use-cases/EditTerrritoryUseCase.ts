import { NotFoundError } from "../../../domain/common/errors";
import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { EditTerritoryDTO } from "../dto/EditTerritoryDTO";
import { IEditTerritoryUseCase } from "../interfaces/IEditTerritoryUseCase";
import { TerritoryMapper } from "../../territory/mappers/TerritoryMapper";
import { BadRequestError } from "../../../domain/common/errors";

export class EditTerritoryUseCase implements IEditTerritoryUseCase {
  constructor(
    private _territoryRepository: ITerritoryRepository
  ) {}
  async execute(
    territoryId: string,
    data: EditTerritoryDTO,
    userId?: string
  ): Promise<string> {
    if (!userId) throw new BadRequestError(ErrorMessages.UNAUTHORIZED);
    const territory = await this._territoryRepository.findById(territoryId);
    if (!territory) throw new NotFoundError(ErrorMessages.TERR_NOT_FOUND);
    const territories = await this._territoryRepository.getAllTerritories();
    if (territories) {
      const existDepartment = territories.some(
        (t) =>
          t.id !== territoryId &&
          t.name.trim().toLowerCase() === data.name.trim().toLowerCase()
      );
      if (existDepartment)
        throw new BadRequestError(ErrorMessages.DEPARTMENT_EXIST);
    }
    const mapped = TerritoryMapper.toTerritoryEntity(data);
    const resp = await this._territoryRepository.updateTerritory(
      territoryId,
      mapped
    );
    if (!resp) throw new NotFoundError(ErrorMessages.TERR_NOT_FOUND);
    return SuccessMessages.UPDATE_SUCCESS;
  }
}
