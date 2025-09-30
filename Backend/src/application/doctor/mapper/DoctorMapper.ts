import { RegisterDoctorDTO } from "../dto/RegisterDoctorDTO";
import { IDoctor } from "../../../domain/doctor/entities/IDoctor";
import { CompleteDoctorProfileDTO } from "../dto/CompleteProfileDTO";

export class DoctorMapper {
  static toDoctorEntity(
    dto: RegisterDoctorDTO | CompleteDoctorProfileDTO,
    loginId: string
  ): Omit<IDoctor, "id" | "createdAt" | "updatedAt"> {
    return {
      name: dto.name,
      phone: dto.phone,
      departmentId: dto.departmentId,
      territoryId: dto.territoryId,
      hospital: dto.hospital,
      registrationId: dto.registrationId,
      licenseImageUrl: dto.licenseImageUrl,
      opHours: dto.opHours ,
      hasOwnClinic: dto.hasOwnClinic,
      loginId,
    };
  }
}
