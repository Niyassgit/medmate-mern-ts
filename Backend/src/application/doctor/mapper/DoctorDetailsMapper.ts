import { IDoctorWithUser } from "../../../domain/doctor/entities/IDoctorWithUser";
import { DoctorDetailsDTO } from "../dto/DoctorDetailsDTO";
import { CompleteDoctorProfileDTO } from "../dto/CompleteProfileDTO";
import { IDoctor } from "../../../domain/doctor/entities/IDoctor";

export class DoctorDetailsMapper {
  static toDoctorDetails(doctor: IDoctorWithUser): DoctorDetailsDTO {
    return {
      id: doctor.id,
      name: doctor.name,
      phone: doctor.phone,
      email: doctor.user?.email ?? null,
      isBlocked: doctor.user?.isBlocked ?? null,
      profileImage: doctor.user?.profileImage ?? null,
      departmentId: doctor.departmentId ?? null,
      experienceYears: doctor.experienceYears ?? null,
      hasOwnClinic: doctor.hasOwnClinic ?? null,
      doctorClass: doctor.doctorClass ?? null,
      territoryId: doctor.territoryId ?? null,
      hospital: doctor.hospital ?? "",
      registrationId: doctor.registrationId ?? "",
      opHours: doctor.opHours ?? null,
      about: doctor.about ?? null,
      licenseImageUrl:doctor.licenseImageUrl ?? null,
      educations: doctor.educations ?? [],
      certificates: doctor.certificates ?? [],
    };
  }

  static toCompleteProfileDTO(doctor: IDoctor): CompleteDoctorProfileDTO {
    return {
      name: doctor.name,
      phone: doctor.phone,
      departmentId: doctor.departmentId ?? null,
      experienceYears: doctor.experienceYears ?? null,
      hasOwnClinic: doctor.hasOwnClinic ?? null,
      doctorClass: doctor.doctorClass ?? null,
      territoryId: doctor.territoryId ?? null,
      hospital: doctor.hospital ?? "",
      registrationId: doctor.registrationId ?? "",
      licenseImageUrl: doctor.licenseImageUrl ?? null,
      opHours: doctor.opHours ?? null,
      about: doctor.about ?? null,
      educations: doctor.educations ?? [],
      certificates: doctor.certificates ?? [],
    };
  }
}
