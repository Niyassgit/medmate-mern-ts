import { IMedicalRepWithUser } from "../../../domain/medicalRep/entities/IMedicalRepWithUser";
import { MedicalRepDetailsDTO } from "../dto/MedicalRepDetailsDTO";

export class RepDetailsMapper {
  static toMedicalRepDetails(
    rep: IMedicalRepWithUser,
    profileImageUrl: string | null
  ): MedicalRepDetailsDTO {
    return {
      id: rep.id,
      name: rep.name,
      email: rep.user?.email ?? null,
      phone: rep.phone,
      companyName: rep.companyName,
      companyLogoUrl: rep.companyLogoUrl ?? null,
      employeeId: rep.employeeId ?? null,
      isBlocked: rep.user?.isBlocked ?? null,
      maxConnectionsPerDay: rep.maxConnectionsPerDay ?? null,
      subscriptionStatus: rep.subscriptionStatus ?? null,
      profileImage: profileImageUrl,
      about: rep.about ?? null,
      educations: rep.educations ?? [],
      certificates: rep.certificates ?? [],
      loginId:rep.loginId,
      departmentName:rep.departmentName ?? null,
      territoryNames:rep.territoryNames ?? [],
    };
  }
}
