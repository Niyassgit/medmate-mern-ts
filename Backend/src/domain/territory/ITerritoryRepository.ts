import { CreateTerritoryDTO } from "../../application/territory/dto/CreateTerritoryDTO";
import { ITerritory } from "./entity/ITerritories";

export interface ITerritoryRepository{
    findAllTerritories(userId:string):Promise<ITerritory[] | null>;
    createTerritory(dto:CreateTerritoryDTO):Promise<ITerritory | null>;
}