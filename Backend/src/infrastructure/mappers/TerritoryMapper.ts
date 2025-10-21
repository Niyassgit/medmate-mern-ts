import { Prisma, Territory } from "@prisma/client";
import { ITerritory} from "../../domain/territory/entity/ITerritories";

export class TerritoryMapper{
    static toPersistance(entitiy:Omit<ITerritory, "id"| "createdAt" | "updatedAt">):Prisma.TerritoryCreateInput{
        return{
            name:entitiy.name,
            region:entitiy.region
        }
    }
    static toDomain(territory:Territory):ITerritory{
        return {
            id:territory.id,
            name:territory.name,
            region:territory.region,
            createdAt:territory.createdAt,
            updatedAt:territory.updatedAt
        }
    }
      static toListTerritories(persistane:Territory[]):ITerritory[]{
            return persistane.map((ter)=>({
                id:ter.id,
                name:ter.name,
                region:ter.region,
                createdAt:ter.createdAt,
                updatedAt:ter.updatedAt,

            }))
        }
}