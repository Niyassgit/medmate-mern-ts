import { IDoctor } from "../../domain/doctor/entities/IDoctor";
import { IDoctorListItem } from "../../domain/doctor/entities/IDoctorListItem";
import { Doctor, User } from "@prisma/client";

export class DoctorMapper {
  static toDomain(doctor: Doctor): IDoctor {
    return {
      id: doctor.id,
      name: doctor.name,
      phone: doctor.phone,
      departmentId: doctor.departmentId ?? null,
      experienceYears: doctor.experienceYears ?? null,
      hasOwnClinic: doctor.hasOwnClinic ?? null,
      doctorClass: doctor.doctorClass ?? null,
      territoryId: doctor.territoryId ?? null,
      loginId: doctor.loginId ?? null,
      registrationId: doctor.registrationId,
      hospital: doctor.hospital,
      licenseImageUrl: doctor.licenseImageUrl,
      opHours: doctor.opHours ?? null,
      about: doctor.about ?? null,
      educations: doctor.educations ?? [],
      certificates: doctor.certificates ?? [],
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    };
  }

  static toListItem(doctor: Doctor & { login: User | null }): IDoctorListItem {
    return {
      id: doctor.id,
      name: doctor.name,
      email: doctor.login?.email ?? null,
      phone: doctor.phone,
      isBlocked: doctor.login?.isBlocked ?? null,
      createdAt: doctor.login?.createdAt ?? null,
      hospital: doctor.hospital,
      loginId: doctor.login?.id ?? null,
    };
  }

  static toPersistance(
    domain: Omit<IDoctor, "id" | "createdAt" | "updatedAt">
  ): Omit<Doctor, "id" | "createdAt" | "updatedAt"> {
    return {
      name: domain.name,
      phone: domain.phone,
      departmentId: domain.departmentId ?? null,
      experienceYears: domain.experienceYears ?? null,
      hasOwnClinic: domain.hasOwnClinic ?? null,
      doctorClass: domain.doctorClass ?? null,
      territoryId: domain.territoryId ?? null,
      loginId: domain.loginId ?? null,
      registrationId: domain.registrationId,
      hospital: domain.hospital,
      licenseImageUrl: domain.licenseImageUrl,
      opHours: domain.opHours ?? null,
      about: domain.about ?? null,
      educations: domain.educations ?? [],
      certificates: domain.certificates ?? [],
    };
  }
}
