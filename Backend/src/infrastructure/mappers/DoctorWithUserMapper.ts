import { IDoctorWithUser } from "../../domain/doctor/entities/IDoctorWithUser";
import { Doctor,User,Department,Territory } from "@prisma/client";
import { DoctorMapper } from "./DoctorMapper";
import { AuthProvider as DomainAuthProvider,Role as DomainRole } from "../../shared/Enums";

export class DoctorWithUserMapper {
  static toDomain(doctor: Doctor & { user?: User | null; department?: Department | null; territory?: Territory | null;}): IDoctorWithUser {
    return {
      ...DoctorMapper.toDomain(doctor),
      user: doctor.user
        ? {
            id: doctor.user.id,
            email: doctor.user.email,
            isBlocked: doctor.user.isBlocked,
            createdAt: doctor.user.createdAt,
            updatedAt: doctor.user.updatedAt,
            profileImage:doctor.user.profileImage,
            role: doctor.user.role as DomainRole,
            authProvider: doctor.user.authProvider as DomainAuthProvider,
            providerId: doctor.user.providerId ?? null,
            isVerified: doctor.user.isVerified,
            tokenVersion: doctor.user.tokenVersion,
            password: doctor.user.password ?? null,
          }
        : null,
    };
  }
}