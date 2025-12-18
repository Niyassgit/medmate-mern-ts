import { ITerritory } from "../../../domain/territory/entity/ITerritories";
import { ITerritoryUsersMinimal } from "../../../domain/territory/entity/ITerritoryUsersMinimal";
import { CreateTerritoryDTO } from "../../superAdmin/dto/CreateTerritoryDTO";
import { TerritoryDTO } from "../../superAdmin/dto/TerritoriesDTO";
import { TerritoryDetailsDTO } from "../../superAdmin/dto/TerritoryDetailsDTO";
import { TerritoryOptionsDTO } from "../dto/TerritoryOptionsDTO";

export class TerritoryMapper {
  static toTerritoryEntity(
    dto: CreateTerritoryDTO
  ): Omit<ITerritory, "id" | "createdAt" | "updatedAt"> {
    return {
      name: dto.name,
      region: dto.region,
    };
  }
  static toDomainList(entities: ITerritory[]): TerritoryDTO[] {
    return entities.map((entity) => ({
      id: entity.id,
      createdAt: entity.createdAt,
      name: entity.name,
      region: entity.region,
    }));
  }
  static toDomainOptions(entities: ITerritory[]): TerritoryOptionsDTO[] {
    return entities.map((entity) => ({
      id: entity.id,
      name: entity.name,
    }));
  }

  static toDomainTerritoryUsers(
    data: ITerritoryUsersMinimal
  ): TerritoryDetailsDTO {
    return {
      users: data.users.map((user) => ({
        id: user.id,
        name: user.name,
        role: user.role,
        department: user.department,
        phone: user.phone,
      })),
      count: data.totalCount || data.users.length,
    };
  }
}
