import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { NotFoundError } from "../../errors";
import { TerritoriesListDTO } from "../dto/TerritoriesListDTO";
import { IGetTerritoriesUseCase } from "../interfaces/IGetTerritoriesUseCase";
import { TerritoryMapper } from "../mappers/TerritoryMapper";

export class GetTerritoriesUseCase implements IGetTerritoriesUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _territoryRepository: ITerritoryRepository
  ) {}

 async execute(userId: string, page: number, limit: number, search: string): Promise<TerritoriesListDTO | null> {
      const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const { territories, total } =
      await this._territoryRepository.findAllTerritories(page, limit, search);
    if (!territories) return null;
    return {
        territories:TerritoryMapper.toDomainList(territories),
        total,
    }
 }
   
}
