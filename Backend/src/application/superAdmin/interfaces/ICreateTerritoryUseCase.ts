import { CreateTerritoryDTO } from "../dto/CreateTerritoryDTO";

export interface ICreateTerritoryUseCase{
    execute(userId:string,formdata:CreateTerritoryDTO):Promise<string>;
}