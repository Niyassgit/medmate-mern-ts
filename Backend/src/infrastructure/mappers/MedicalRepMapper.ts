import { IMedicalRep } from "../../domain/medicalRep/entities/IMedicalRep";
import { IRepListItem } from "../../domain/medicalRep/entities/IRepListItem";
import { MedicalRep, User } from "@prisma/client";

export class MedicalRepMapper {
  static toDomain(rep: MedicalRep): IMedicalRep {
    return {
      id: rep.id,
      name: rep.name,
      phone: rep.phone,
      companyName: rep.companyName,
      companyLogoUrl: rep.companyLogoUrl ?? null,
      employeeId: rep.employeeId ?? null,
      departmentId: rep.departmentId ?? null,
      about: rep.about ?? null,
      subscriptionPlanId: rep.subscriptionPlanId ?? null,
      subscriptionStatus: rep.subscriptionStatus,
      subscriptionStart: rep.subscriptionStart ?? null,
      subscriptionEnd: rep.subscriptionEnd ?? null,
      maxConnectionsPerDay: rep.maxConnectionsPerDay,
      loginId: rep.loginId,
      createdAt: rep.createdAt,
      updatedAt: rep.updatedAt,
      profileImage:rep.profileImage
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
  ): Omit<MedicalRep, "id" | "createdAt" | "updatedAt"> {
    return {
      name: domain.name,
      phone: domain.phone,
      companyName: domain.companyName,
      companyLogoUrl: domain.companyLogoUrl ?? null,
      employeeId: domain.employeeId ?? null,
      departmentId: domain.departmentId ?? null,
      about: domain.about ?? null,
      subscriptionPlanId: domain.subscriptionPlanId ?? null,
      subscriptionStatus: domain.subscriptionStatus ?? null,
      subscriptionStart: domain.subscriptionStart ?? null,
      subscriptionEnd: domain.subscriptionEnd ?? null,
      loginId: domain.loginId,
      maxConnectionsPerDay: domain.maxConnectionsPerDay ?? 0,
      profileImage:domain.profileImage?? null,  
    };
  }

  static toPartialPersistence(
  domain: Partial<IMedicalRep>
): Partial<MedicalRep> {
  const persistence: Partial<MedicalRep> = {};

  if (domain.name !== undefined) persistence.name = domain.name;
  if (domain.phone !== undefined) persistence.phone = domain.phone;
  if (domain.companyName !== undefined) persistence.companyName = domain.companyName;
  if (domain.companyLogoUrl !== undefined) persistence.companyLogoUrl = domain.companyLogoUrl ?? null;
  if (domain.employeeId !== undefined) persistence.employeeId = domain.employeeId ?? null;
  if (domain.departmentId !== undefined) persistence.departmentId = domain.departmentId ?? null;
  if (domain.about !== undefined) persistence.about = domain.about ?? null;
  if (domain.subscriptionPlanId !== undefined) persistence.subscriptionPlanId = domain.subscriptionPlanId ?? null;
  if (domain.subscriptionStatus !== undefined) persistence.subscriptionStatus = domain.subscriptionStatus;
  if (domain.subscriptionStart !== undefined) persistence.subscriptionStart = domain.subscriptionStart;
  if (domain.subscriptionEnd !== undefined) persistence.subscriptionEnd = domain.subscriptionEnd;
  if (domain.maxConnectionsPerDay !== undefined) persistence.maxConnectionsPerDay = domain.maxConnectionsPerDay;
  if (domain.loginId !== undefined) persistence.loginId = domain.loginId;
  if (domain.profileImage !== undefined) persistence.profileImage = domain.profileImage;

  return persistence;
}

}
