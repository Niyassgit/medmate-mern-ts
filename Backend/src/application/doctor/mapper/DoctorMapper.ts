import { RegisterDoctorDTO } from "../dto/RegisterDoctorDTO";
import { IDoctor } from "../../../domain/doctor/entities/IDoctor";
import { CompleteDoctorProfileDTO } from "../dto/CompleteProfileDTO";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { DoctorPreviewForGuestDTO } from "../dto/DoctorPreviewForGuestDTO";
import { IDoctorWithUser } from "../../../domain/doctor/entities/IDoctorWithUser";


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

  static async forGuest(E:IDoctorWithUser,storageService:IStorageService):Promise<DoctorPreviewForGuestDTO>{

    let signedUrl:string|null=null;
    if(E.user?.profileImage){
      signedUrl=await storageService.generateSignedUrl(E.user.profileImage);
    }
    return{
      id:E.id,
       name:E.name,
      about:E.about ?? "",
      createdAt:E.createdAt,
      hospitalName:E.hospital,
      profileImage:signedUrl
    }
  }

}
