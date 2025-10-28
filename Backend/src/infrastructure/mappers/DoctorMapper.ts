import { IDoctor } from "../../domain/doctor/entities/IDoctor";
import { IDoctorListItem } from "../../domain/doctor/entities/IDoctorListItem";
import { Doctor, User, Education, Certificate } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { IDoctorListOnRep } from "../../domain/doctor/entities/IDoctorListOnRep";

export class DoctorMapper {
  static toDomain(
    doctor: Doctor & {
      educations?: Education[];
      certificates?: Certificate[];
      department?: { name: string } | null;
      territory?: { name: string } | null;
    }
  ): IDoctor {
    return {
      id: doctor.id,
      name: doctor.name,
      phone: doctor.phone,
      departmentId: doctor.departmentId ?? null,
      experienceYears: doctor.experienceYears ?? null,
      hasOwnClinic: doctor.hasOwnClinic ?? null,
      doctorClass: doctor.doctorClass ?? null,
      territoryId: doctor.territoryId ?? "",
      loginId: doctor.loginId ?? null,
      registrationId: doctor.registrationId,
      hospital: doctor.hospital,
      licenseImageUrl: doctor.licenseImageUrl,
      opHours: doctor.opHours ?? null,
      about: doctor.about ?? null,
      departmentName:doctor.department?.name,
      territoryName:doctor.territory?.name,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,

      educations: doctor.educations?.map((edu) => ({
        id: edu.id,
        degree: edu.degree,
        institute: edu.institute,
        year: edu.year ?? null,
      })),

      certificates: doctor.certificates?.map((cert) => ({
        id: cert.id,
        name: cert.name,
        issuedBy: cert.issuedBy ?? null,
        year: cert.year ?? null,
      })),
    };
  }

  static toListItem(doctor: Doctor & { user?: User | null }): IDoctorListItem {
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
  ): Prisma.DoctorCreateInput {
    return {
      name: domain.name,
      phone: domain.phone,
      experienceYears: domain.experienceYears ?? null,
      hasOwnClinic: domain.hasOwnClinic ?? null,
      doctorClass: domain.doctorClass ?? null,
      registrationId: domain.registrationId,
      hospital: domain.hospital,
      licenseImageUrl: domain.licenseImageUrl,
      opHours: domain.opHours ?? null,
      about: domain.about ?? null,
      user: domain.loginId ? { connect: { id: domain.loginId } } : undefined,

      department: domain.departmentId
        ? { connect: { id: domain.departmentId } }
        : undefined,

      territory: domain.territoryId
        ? { connect: { id: domain.territoryId } }
        : undefined,

      educations: {
        create: domain.educations?.map((edu) => ({
          degree: edu.degree,
          institute: edu.institute,
          year: edu.year ?? null,
        })),
      },
      certificates: {
        create: domain.certificates?.map((cert) => ({
          name: cert.name,
          issuedBy: cert.issuedBy ?? null,
          year: cert.year ?? null,
        })),
      },
    };
  }

  static toPartialPersistence(
    domain: Partial<IDoctor>
  ): Prisma.DoctorUpdateInput {
    const data: Prisma.DoctorUpdateInput = {};

    // simple fields
    if (domain.name !== undefined) data.name = domain.name;
    if (domain.phone !== undefined) data.phone = domain.phone;
    if (domain.hospital !== undefined) data.hospital = domain.hospital;
    if (domain.registrationId !== undefined)
      data.registrationId = domain.registrationId;
    if (domain.licenseImageUrl !== undefined)
      data.licenseImageUrl = domain.licenseImageUrl;
    if (domain.opHours !== undefined) data.opHours = domain.opHours;
    if (domain.about !== undefined) data.about = domain.about;
    if (domain.experienceYears !== undefined)
      data.experienceYears = domain.experienceYears;
    if (domain.hasOwnClinic !== undefined)
      data.hasOwnClinic = domain.hasOwnClinic;
    if (domain.doctorClass !== undefined) data.doctorClass = domain.doctorClass;

    // relations
    if (domain.departmentId !== undefined) {
      data.department = domain.departmentId
        ? { connect: { id: domain.departmentId } }
        : { disconnect: true };
    }
    if (domain.territoryId !== undefined) {
      data.territory = domain.territoryId
        ? { connect: { id: domain.territoryId } }
        : { disconnect: true };
    }

    // nested relations
    if (domain.educations) {
      data.educations = {
        deleteMany: {},
        create: domain.educations.map((edu) => ({
          degree: edu.degree,
          institute: edu.institute,
          year: edu.year ?? null,
        })),
      };
    }

    if (domain.certificates) {
      data.certificates = {
        deleteMany: {},
        create: domain.certificates.map((cert) => ({
          name: cert.name,
          issuedBy: cert.issuedBy ?? null,
          year: cert.year ?? null,
        })),
      };
    }

    return data;
  }
  static toListOnRep(persistance:Doctor& { user: User | null }):IDoctorListOnRep{
    return {
      id:persistance.id,
      name:persistance.name,
      hospital:persistance.hospital,
      departmentId:persistance.departmentId,
      territoryId:persistance.territoryId,
      image:persistance.user?.profileImage ?? null,
    }
  }
}
