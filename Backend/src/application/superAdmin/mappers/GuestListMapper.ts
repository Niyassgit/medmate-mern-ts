import { IGuestListItem } from "../../../domain/Patient/entities/IGuestListItem";
import { GuestListDTO } from "../dto/GuestListDTO";

export class GuestListMapper {
  static toGuestListDTO(entity: IGuestListItem): GuestListDTO {
    if (!entity) {
      throw new Error("GuestListItem entity is undefined");
    }
    if (typeof entity !== 'object') {
      throw new Error("GuestListItem entity is not an object");
    }
    
    try {
      return {
        id: entity.id,
        name: entity.name,
        email: entity.email ?? null,
        phone: entity.phone ?? null,
        isBlocked: entity.isBlocked ?? null,
        territory: entity.territoryName ?? null,
        createdAt: entity.createdAt ?? null,
        loginId: entity.loginId ?? null,
      };
    } catch (error) {
      throw error;
    }
  }
}

