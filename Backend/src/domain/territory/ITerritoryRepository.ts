import { CreateTerritoryDTO } from "../../application/territory/dto/CreateTerritoryDTO";
import { ITerritory } from "./entity/ITerritories";

export interface ITerritoryRepository {
    findById(territoryId:string):Promise<ITerritory | null>;
  findAllTerritories(): Promise<ITerritory[] | null>;
  createTerritory(data: CreateTerritoryDTO): Promise<ITerritory | null>;
  updateTerritory(
    territoryId: string,
    data: CreateTerritoryDTO
  ): Promise<ITerritory | null>;
}
