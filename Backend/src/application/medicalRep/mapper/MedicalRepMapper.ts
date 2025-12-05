import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IMedicalRep } from "../../../domain/medicalRep/entities/IMedicalRep";
import { IMedicalRepWithUser } from "../../../domain/medicalRep/entities/IMedicalRepWithUser";
import { MedicalRepDetailsOnDoctorDTO } from "../../doctor/dto/MedicalRepDetailsDTO";
import { MiniMedicalRepDetailsOnDoctor } from "../../doctor/dto/MiniMedicalRepDetailsOnDoctor";
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
      maxConnectionsPerDay: 3,
      companyLogoUrl: logoUrl,
      loginId,
      about: (dto as CompleteRepProfileDTO).about ?? null,
      educations: (dto as CompleteRepProfileDTO).educations ?? [],
      certificates: (dto as CompleteRepProfileDTO).certificates ?? [],
      departmentId: dto.departmentId ?? "",
      territories: dto.territories ?? [],
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
      departmentId: dto.departmentId ?? existingRep.departmentId,
      educations: dto.educations ?? existingRep.educations,
      certificates: dto.certificates ?? existingRep.certificates,
      territories: dto.territories ?? existingRep.territories,
    };
  }

  static async toDoctorDomian(
    rep: IMedicalRepWithUser,
    isConnected: boolean,
    storageService: IStorageService
  ): Promise<MiniMedicalRepDetailsOnDoctor> {
    let signedUrl: string | null = null;
    if (rep.user?.profileImage) {
      signedUrl = await storageService.generateSignedUrl(rep.user.profileImage);
    }
    return {
      id: rep.id,
      name: rep.name,
      profileImage: signedUrl,
      about: rep.about ?? null,
      companyName: rep.companyName,
      isConnected: isConnected,
    };
  }
  static async repDetailsOnDoctorDomain(
    rep: IMedicalRepWithUser,
    storageService: IStorageService,
    connectionStatus: string | null = null,
    connectionInitiator: string | null = null
  ):Promise< MedicalRepDetailsOnDoctorDTO >{
    let signedUrl: string | null = null;
    if (rep.user?.profileImage) {
      signedUrl = await storageService.generateSignedUrl(rep.user.profileImage);
    }
    return {
      id: rep.id,
      name: rep.name,
      about: rep.about ?? null,
      companyLogoUrl: rep.companyLogoUrl ?? "",
      companyName: rep.companyName,
      email: rep.user?.email ?? null,
      employeeId: rep.employeeId ?? null,
      loginId: rep.loginId,
      phone: rep.phone,
      profileImage: signedUrl,
      certificates: rep.certificates,
      educations: rep.educations,
      connectionStatus,
      connectionInitiator,
    };
  }
}
