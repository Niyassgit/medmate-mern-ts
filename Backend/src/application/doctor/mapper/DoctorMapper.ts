import { RegisterDoctorDTO } from "../dto/RegisterDoctorDTO";
import { IDoctor } from "../../../domain/doctor/entities/IDoctor";
import { CompleteDoctorProfileDTO } from "../dto/CompleteProfileDTO";
import { IMedicalRepListOnDoc } from "../../../domain/medicalRep/entities/IMedicalRepListOnDoc";
import { IDepartmentRepository } from "../../../domain/department/repositories/IDepartmentRepository";
import { IStorageService } from "../../../domain/common/services/IStorageService";


export class DoctorMapper {
  static toDoctorEntity(
    dto: RegisterDoctorDTO,
    loginId: string,
    opSession:string | null,
  ): Omit<IDoctor, "id" | "createdAt" | "updatedAt"> {
    return {
      name: dto.name,
      phone: dto.phone,
      departmentId: dto.departmentId ?? null,
      territoryId: dto.territoryId ?? "",
      hospital: dto.hospital,
      registrationId: dto.registrationId,
      licenseImageUrl: dto.licenseImageUrl,
      opStartTime:dto.opStartTime ?? null,
      opEndTime:dto.opEndTime ?? null,
      opSession:opSession,
      hasOwnClinic: dto.hasOwnClinic,
      loginId,
    };
  }

    static toCompleteProfile(
    dto:CompleteDoctorProfileDTO,
    loginId: string,
    opSession:string | null,
  ): Omit<IDoctor, "id" | "createdAt" | "updatedAt"> {
    return {
      name: dto.name,
      phone: dto.phone,
      departmentId: dto.departmentId ?? null,
      territoryId: dto.territoryId ?? "",
      hospital: dto.hospital,
      registrationId: dto.registrationId,
      licenseImageUrl: dto.licenseImageUrl,
      opStartTime:dto.opStartTime,
      opEndTime:dto.opEndTime,
      opSession:opSession ?? null,
      hasOwnClinic: dto.hasOwnClinic,
      dob:dto.dob?new Date(dto.dob) : null,
      about: dto.about,      
      educations: dto.educations ?? [],   
      certificates: dto.certificates ?? [], 
      loginId,
    };
  } 

}
