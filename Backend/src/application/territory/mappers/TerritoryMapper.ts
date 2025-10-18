import { ITerritory } from "../../../domain/territory/entity/ITerritories";
import { CreateTerritoryDTO } from "../dto/CreateTerritoryDTO";
import { TerritoriesDTO } from "../dto/TerritoriesDTO";


export class TerritoryMapper{
    static toDomain(persistance:ITerritory[]):TerritoriesDTO[]{
        return persistance.map((terry)=>({
            id:terry.id,
            name:terry.name,
            region:terry.region,
            createdAt:terry.createdAt,
        }))
    }

   static toTerritoryEntity(dto:CreateTerritoryDTO):Omit<ITerritory, "id" | "createdAt" | "updatedAt">{
    return{
     name:dto.name,
     region:dto.region
    }
   }
}