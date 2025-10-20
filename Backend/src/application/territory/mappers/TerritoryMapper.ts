import { ITerritory } from "../../../domain/territory/entity/ITerritories";
import { CreateTerritoryDTO } from "../dto/CreateTerritoryDTO";
import { TerritoryDTO } from "../dto/TerritoriesDTO";


export class TerritoryMapper{

   static toTerritoryEntity(dto:CreateTerritoryDTO):Omit<ITerritory, "id" | "createdAt" | "updatedAt">{
    return{
     name:dto.name,
     region:dto.region
    }
   }
   static toDomainList(entities:ITerritory[]):TerritoryDTO[]{
    return entities.map((entity)=>({
        id:entity.id,
        createdAt:entity.createdAt,
        name:entity.name,
        region:entity.region,
    }))
   }
}