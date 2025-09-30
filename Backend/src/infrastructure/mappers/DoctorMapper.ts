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
      profileImage:doctor.profileImage
    };
  }

  static toListItem(doctor: Doctor & { user: User | null }): IDoctorListItem {
    return {
      id: doctor.id,
      name: doctor.name,
      email: doctor.user?.email ?? null,
      phone: doctor.phone,
      isBlocked: doctor.user?.isBlocked ?? null,
      createdAt: doctor.user?.createdAt ?? null,
      hospital: doctor.hospital,
      loginId: doctor.user?.id ?? null,
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
      profileImage:domain.profileImage ?? null
    };
  }
   static toPartialPersistence(domain: Partial<IDoctor>): Partial<Doctor> {
    const data: Partial<Doctor> = {};

    if (domain.name !== undefined) data.name = domain.name;
    if (domain.phone !== undefined) data.phone = domain.phone;
    if (domain.departmentId !== undefined) data.departmentId = domain.departmentId;
    if (domain.experienceYears !== undefined) data.experienceYears = domain.experienceYears;
    if (domain.hasOwnClinic !== undefined) data.hasOwnClinic = domain.hasOwnClinic;
    if (domain.doctorClass !== undefined) data.doctorClass = domain.doctorClass;
    if (domain.territoryId !== undefined) data.territoryId = domain.territoryId;
    if (domain.loginId !== undefined) data.loginId = domain.loginId;
    if (domain.registrationId !== undefined) data.registrationId = domain.registrationId;
    if (domain.hospital !== undefined) data.hospital = domain.hospital;
    if (domain.licenseImageUrl !== undefined) data.licenseImageUrl = domain.licenseImageUrl;
    if (domain.opHours !== undefined) data.opHours = domain.opHours;
    if (domain.about !== undefined) data.about = domain.about;
    if (domain.educations !== undefined) data.educations = domain.educations;
    if (domain.certificates !== undefined) data.certificates = domain.certificates;
    if (domain.profileImage !== undefined) data.profileImage = domain.profileImage;

    return data;
  }
}
