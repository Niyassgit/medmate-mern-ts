import { IGuestListItem } from "../../../domain/Patient/entities/IGuestListItem";
import { GuestListDTO } from "../dto/GuestListDTO";

export class GuestListMapper {
  static toGuestListDTO(entity: IGuestListItem): GuestListDTO {
    if (!entity) {
      console.error("GuestListMapper.toGuestListDTO - entity is undefined");
      throw new Error("GuestListItem entity is undefined");
    }
    if (typeof entity !== 'object') {
      console.error("GuestListMapper.toGuestListDTO - entity is not an object:", typeof entity, entity);
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
      console.error("GuestListMapper.toGuestListDTO - Error accessing entity properties:", error);
      console.error("GuestListMapper.toGuestListDTO - Entity structure:", {
        hasId: !!entity.id,
        hasName: !!entity.name,
        hasEmail: 'email' in entity,
        emailValue: entity.email,
        entityKeys: Object.keys(entity),
      });
      throw error;
    }
  }
}

