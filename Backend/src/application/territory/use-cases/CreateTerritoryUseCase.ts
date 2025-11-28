import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError,NotFoundError } from "../../../domain/common/errors";
import { CreateTerritoryDTO } from "../../superAdmin/dto/CreateTerritoryDTO";
import { ICreateTerritoryUseCase } from "../interfaces/ICreateTerritoryUseCase";
import { TerritoryMapper } from "../mappers/TerritoryMapper";


export class CreateTerritoryUseCase implements ICreateTerritoryUseCase{
    constructor(
        private _territoryRepository:ITerritoryRepository,
    ){}

    async execute(dto: CreateTerritoryDTO,userId?:string,): Promise<string> {
        if(!userId) throw new NotFoundError(ErrorMessages.UNAUTHORIZED);
        const territories=await this._territoryRepository.getAllTerritories();
        const existTerritory=territories.some((T)=>T.name===dto.name);
        if(existTerritory) throw new BadRequestError(ErrorMessages.TERRITORY_EXIST);
        const formated=TerritoryMapper.toTerritoryEntity(dto);
        await this._territoryRepository.createTerritory(formated);
        return SuccessMessages.TERRITORY_ADDED;

    }
}