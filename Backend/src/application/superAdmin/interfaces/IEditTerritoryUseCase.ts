import { EditTerritoryDTO } from "../dto/EditTerritoryDTO";

export interface IEditTerritoryUseCase{
    execute(territoryId:string,dto:EditTerritoryDTO,userId?:string,):Promise<string>;
}