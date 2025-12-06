import { IDoctorListItem } from "../../../domain/doctor/entities/IDoctorListItem";
import { DoctorListDTO } from "../dto/DoctorListDTO";

export class DoctorListMapper {
  static toDoctorListDTO(entity: IDoctorListItem): DoctorListDTO {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      isBlocked: entity.isBlocked,
      hospital: entity.hospital,
      createdAt: entity.createdAt,
      loginId: entity.loginId,
      territory:entity.territoryName,
    };
  }
}
