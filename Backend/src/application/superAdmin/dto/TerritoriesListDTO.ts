import { TerritoryDTO } from "../../superAdmin/dto/TerritoriesDTO";

export interface TerritoriesListDTO{
    territories:TerritoryDTO[],
    total:number
}