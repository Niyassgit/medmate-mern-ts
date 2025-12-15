import { TerritoryDetailsDTO } from "../dto/TerritoryDetailsDTO";

export interface ITerritoryDetailsUseCase{
  execute(territoryId:string):Promise<TerritoryDetailsDTO>;
}