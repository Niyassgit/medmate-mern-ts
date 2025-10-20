import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { NotFoundError } from "../../errors";
import { TerritoryDTO } from "../dto/TerritoriesDTO";
import { IGetTerritoriesUseCase } from "../interfaces/IGetTerritoriesUseCase";
import { TerritoryMapper } from "../mappers/TerritoryMapper";


export class GetTerritoriesUseCase implements IGetTerritoriesUseCase{
    
    constructor(
        private _userRepository:IUserRepository,
        private _territoryRepository:ITerritoryRepository
    ){}

    async execute(userId: string): Promise<TerritoryDTO[] | null> {
        const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        const territories =await this._territoryRepository.findAllTerritories();
        if(!territories) return null;
        return TerritoryMapper.toDomainList(territories);
    }
}