import { IMedicalRep } from "../../../domain/medicalRep/entities/IMedicalRep";
import { CompleteRepProfileDTO } from "../dto/CompleteRepProfileDTO";
import { RegisterMedicalRepDTO } from "../dto/RegisterMedicalRepDTO";

export class MedicalRepMapper {
  static toMedicalRepEntity(
    dto: RegisterMedicalRepDTO | CompleteRepProfileDTO,
    loginId: string
  ): Omit<IMedicalRep, "id" | "createdAt" | "updatedAt"> {
    return {
      name: dto.name,
      phone: dto.phone,
      companyName: dto.companyName,
      employeeId: dto.employeeId,
      subscriptionStatus: false,
      maxConnectionsPerDay: 10,
      loginId,
    };
  }
}
