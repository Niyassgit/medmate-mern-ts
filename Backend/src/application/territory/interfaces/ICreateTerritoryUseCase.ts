import { CreateTerritoryDTO } from "../../superAdmin/dto/CreateTerritoryDTO";

export interface ICreateTerritoryUseCase{
    execute(formdata:CreateTerritoryDTO,userId?:string):Promise<string>;
}