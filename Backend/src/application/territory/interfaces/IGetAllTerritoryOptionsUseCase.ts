import { TerritoryOptionsDTO } from "../dto/TerritoryOptionsDTO";

export interface IGetAllTerritoryOptionsUseCase{
    execute():Promise<TerritoryOptionsDTO[] | null>;
}