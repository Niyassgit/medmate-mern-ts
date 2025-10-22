import { NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { EditTerritoryDTO } from "../dto/EditTerritoryDTO";
import { IEditTerritoryUseCase } from "../interfaces/IEditTerritoryUseCase";
import { TerritoryMapper } from "../../territory/mappers/TerritoryMapper";


export class EditTerritoryUseCase implements IEditTerritoryUseCase{
    constructor(
        private _userRepository:IUserRepository,
        private _territoryRepository:ITerritoryRepository
    ){}
    async execute(territoryId: string, data: EditTerritoryDTO,userId: string,): Promise<string> {
        const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
        const territory=await this._territoryRepository.findById(territoryId);
        if(!territory) throw new NotFoundError(ErrorMessages.TERR_NOT_FOUND);
        const mapped=TerritoryMapper.toTerritoryEntity(data);
        const resp=await this._territoryRepository.updateTerritory(territoryId,mapped);
        if(!resp) throw new NotFoundError(ErrorMessages.TERR_NOT_FOUND);
        return SuccessMessages.UPDATE_SUCCESS   

    }
}