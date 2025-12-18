import { CreateTerritoryDTO } from "../../application/superAdmin/dto/CreateTerritoryDTO";
import { ITerritory } from "./entity/ITerritories";
import { ITerritoryUsersMinimal } from "./entity/ITerritoryUsersMinimal";

export interface ITerritoryRepository {
  findById(territoryId: string): Promise<ITerritory | null>;
  getAllTerritories(): Promise<ITerritory[]>;
  findAllTerritories(
    page: number,
    limit: number,
    search: string
  ): Promise<{ territories: ITerritory[]; total: number }>;
  createTerritory(data: CreateTerritoryDTO): Promise<ITerritory | null>;
  updateTerritory(
    territoryId: string,
    data: CreateTerritoryDTO
  ): Promise<ITerritory | null>;
  getTerritoryName(terrId: string): Promise<string | null>;
  territoryUsers(
    territoryId: string,
    page: number,
    limit: number
  ): Promise<ITerritoryUsersMinimal>;
}
