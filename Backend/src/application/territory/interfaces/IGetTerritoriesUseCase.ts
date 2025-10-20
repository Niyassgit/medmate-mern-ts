import {TerritoryDTO } from "../dto/TerritoriesDTO";

export interface IGetTerritoriesUseCase{
    execute(userId:string):Promise<TerritoryDTO[] | null>
}