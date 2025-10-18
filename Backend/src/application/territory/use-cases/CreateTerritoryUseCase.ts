import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { NotFoundError } from "../../errors";
import { CreateTerritoryDTO } from "../dto/CreateTerritoryDTO";
import { ICreateTerritoryUseCase } from "../interfaces/ICreateTerritoryUseCase";
import { TerritoryMapper } from "../mappers/TerritoryMapper";


export class CreateTerritoryUseCase implements ICreateTerritoryUseCase{
    constructor(
        private _userRepository:IUserRepository,
        private _territoryRepository:ITerritoryRepository,
    ){}

    async execute(userId: string, dto: CreateTerritoryDTO): Promise<string> {
        const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        const formated=TerritoryMapper.toTerritoryEntity(dto);
        const resp=await this._territoryRepository.createTerritory(formated);
        return SuccessMessages.TERRITORY_ADDED;

    }
}