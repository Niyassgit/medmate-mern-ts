import { IMedicalRep } from "../../domain/medicalRep/entities/IMedicalRep";
import { IRepListItem } from "../../domain/medicalRep/entities/IRepListItem";
import {
  MedicalRep,
  Prisma,
  User,
  Education,
  Certificate,
} from "@prisma/client";

export class MedicalRepMapper {
  static toDomain(
    rep: MedicalRep & {
      educations?: Education[];
      certificates?: Certificate[];
      territories?: { territory:{name: string }}[];
      department?:{name:string} | null;
    }
  ): IMedicalRep {
    return {
      id: rep.id,
      name: rep.name,
      phone: rep.phone,
      companyName: rep.companyName,
      companyLogoUrl: rep.companyLogoUrl ?? null,
      employeeId: rep.employeeId ?? null,
      about: rep.about ?? null,
      subscriptionPlanId: rep.subscriptionPlanId ?? null,
      subscriptionStatus: rep.subscriptionStatus,
      subscriptionStart: rep.subscriptionStart ?? null,
      subscriptionEnd: rep.subscriptionEnd ?? null,
      maxConnectionsPerDay: rep.maxConnectionsPerDay,
      loginId: rep.loginId,
      createdAt: rep.createdAt,
      updatedAt: rep.updatedAt,
      departmentId: rep.department?.name?? null,
      territories: rep.territories?.map((t) => t.territory.name) ?? [],

      educations: rep.educations?.map((edu) => ({
        id: edu.id,
        degree: edu.degree,
        institute: edu.institute,
        year: edu.year ?? null,
      })),

      certificates: rep.certificates?.map((cert) => ({
        id: cert.id,
        name: cert.name,
        issuedBy: cert.issuedBy ?? null,
        year: cert.year ?? null,
      })),
    };
  }
  static toListMedicalRep(
    rep: MedicalRep & { user: User | null }
  ): IRepListItem {
    return {
      id: rep.id,
      name: rep.name,
      email: rep.user?.email ?? null,
      phone: rep.phone,
      subscriptionStatus: rep.subscriptionStatus,
      employeeId: rep.employeeId,
      isBlocked: rep.user?.isBlocked ?? null,
      createdAt: rep.createdAt,
      loginId: rep.loginId,
    };
  }

  static toPersistance(
    domain: Omit<IMedicalRep, "id" | "createdAt" | "updatedAt">
  ): Prisma.MedicalRepCreateInput {
    const persistence: Prisma.MedicalRepCreateInput = {
      name: domain.name,
      phone: domain.phone,
      companyName: domain.companyName,
      companyLogoUrl: domain.companyLogoUrl ?? null,
      employeeId: domain.employeeId ?? null,
      about: domain.about ?? null,
      subscriptionStatus: domain.subscriptionStatus ?? false,
      subscriptionStart: domain.subscriptionStart ?? null,
      subscriptionEnd: domain.subscriptionEnd ?? null,
      maxConnectionsPerDay: domain.maxConnectionsPerDay ?? 0,

      ...(domain.loginId ? { user: { connect: { id: domain.loginId } } } : {}),

      ...(domain.departmentId
        ? { department: { connect: { id: domain.departmentId } } }
        : {}),

      ...(domain.subscriptionPlanId
        ? { subscriptionPlan: { connect: { id: domain.subscriptionPlanId } } }
        : {}),

      ...(domain.educations
        ? {
            educations: {
              create: domain.educations.map((edu) => ({
                degree: edu.degree,
                institute: edu.institute,
                year: edu.year ?? null,
              })),
            },
          }
        : {}),

      ...(domain.certificates
        ? {
            certificates: {
              create: domain.certificates.map((cert) => ({
                name: cert.name,
                issuedBy: cert.issuedBy ?? null,
                year: cert.year ?? null,
              })),
            },
          }
        : {}),
    };

    return persistence;
  }

  static toPartialPersistence(
    domain: Partial<IMedicalRep>
  ): Prisma.MedicalRepUpdateInput {
    const persistence: Prisma.MedicalRepUpdateInput = {};

    if (domain.name !== undefined) persistence.name = domain.name;
    if (domain.phone !== undefined) persistence.phone = domain.phone;
    if (domain.companyName !== undefined)
      persistence.companyName = domain.companyName;
    if (domain.companyLogoUrl !== undefined)
      persistence.companyLogoUrl = domain.companyLogoUrl ?? null;
    if (domain.employeeId !== undefined)
      persistence.employeeId = domain.employeeId ?? null;
    if (domain.about !== undefined) persistence.about = domain.about ?? null;
    if (domain.subscriptionStatus !== undefined)
      persistence.subscriptionStatus = domain.subscriptionStatus;
    if (domain.subscriptionStart !== undefined)
      persistence.subscriptionStart = domain.subscriptionStart;
    if (domain.subscriptionEnd !== undefined)
      persistence.subscriptionEnd = domain.subscriptionEnd;
    if (domain.maxConnectionsPerDay !== undefined)
      persistence.maxConnectionsPerDay = domain.maxConnectionsPerDay;

    if (domain.loginId !== undefined) {
      persistence.user = domain.loginId
        ? { connect: { id: domain.loginId } }
        : { disconnect: true };
    }

    if (domain.subscriptionPlanId !== undefined) {
      persistence.subscriptionPlan = domain.subscriptionPlanId
        ? { connect: { id: domain.subscriptionPlanId } }
        : { disconnect: true };
    }

    if (domain.departmentId !== undefined) {
      persistence.department = domain.departmentId
        ? { connect: { id: domain.departmentId } }
        : { disconnect: true };
    }

    if (domain.territories) {
      persistence.territories = {
        deleteMany: {},
        create: domain.territories.map((tId) => ({
          territory: { connect: { id: tId } },
        })),
      };
    }

    if (domain.educations) {
      persistence.educations = {
        deleteMany: {},
        create: domain.educations.map((edu) => ({
          degree: edu.degree,
          institute: edu.institute,
          year: edu.year ?? null,
        })),
      };
    }

    if (domain.certificates) {
      persistence.certificates = {
        deleteMany: {},
        create: domain.certificates.map((cert) => ({
          name: cert.name,
          issuedBy: cert.issuedBy ?? null,
          year: cert.year ?? null,
        })),
      };
    }

    return persistence;
  }
}
