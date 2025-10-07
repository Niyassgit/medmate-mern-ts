import { IMedicalRep } from "../../../domain/medicalRep/entities/IMedicalRep";
import { CompleteRepProfileDTO } from "../dto/CompleteRepProfileDTO";
import { RegisterMedicalRepDTO } from "../dto/RegisterMedicalRepDTO";

export class MedicalRepMapper {
  static toMedicalRepEntity(
    dto: RegisterMedicalRepDTO | CompleteRepProfileDTO,
    loginId: string,
    logoUrl: string | null
  ): Omit<IMedicalRep, "id" | "createdAt" | "updatedAt"> {
    return {
      name: dto.name,
      phone: dto.phone,
      companyName: dto.companyName,
      employeeId: dto.employeeId,
      subscriptionStatus: false,
      maxConnectionsPerDay: 10,
      companyLogoUrl: logoUrl,
      loginId,
      about: (dto as CompleteRepProfileDTO).about ?? null,
      educations: (dto as CompleteRepProfileDTO).educations ?? [],
      certificates: (dto as CompleteRepProfileDTO).certificates ?? [],
    };
  }
  static updateMedicalRepEntity(
    existingRep: IMedicalRep,
    dto: CompleteRepProfileDTO,
    logoUrl: string | null
  ): IMedicalRep {
    return {
      ...existingRep,
      name: dto.name ?? existingRep.name,
      phone: dto.phone ?? existingRep.phone,
      companyName: dto.companyName ?? existingRep.companyName,
      employeeId: dto.employeeId ?? existingRep.employeeId,
      companyLogoUrl: logoUrl ?? existingRep.companyLogoUrl,
      about: dto.about ?? existingRep.about,
      educations: dto.educations ?? existingRep.educations,
      certificates: dto.certificates ?? existingRep.certificates,
    };
  }
}
