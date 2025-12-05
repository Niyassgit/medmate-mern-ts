import { IRepListItem } from "../../../domain/medicalRep/entities/IRepListItem";
import { RepListDTO } from "../dto/RepListDTO";

export class RepListMapper {
  static toRepListDTO(entity: IRepListItem): RepListDTO {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      employeeId: entity.employeeId,
      isBlocked: entity.isBlocked,
      subscriptionStatus: entity.subscriptionStatus,
      createdAt: entity.createdAt,
      loginId: entity.loginId,
      territoryNames: entity.territoryNames,
    };
  }
}
