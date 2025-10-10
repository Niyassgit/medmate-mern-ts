import { IUser } from "../../domain/common/entities/IUser";
import { Role as DomainRole } from "../../domain/common/value-objects/Role";
import { AuthProvider as DomainAuthProvider } from "../../domain/common/value-objects/AuthProvider";
import { Prisma, User } from "@prisma/client";

export class UserMapper {
  static toDomain(user: User): IUser {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      authProvider: user.authProvider as DomainAuthProvider,
      role: user.role as DomainRole,
      profileImage: user.profileImage,
      isBlocked: user.isBlocked,
      isVerified: user.isVerified,
      providerId: user.providerId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      tokenVersion: user.tokenVersion,
    };
  }
  static toPersistence(
    domain: Omit<IUser, "id" | "createdAt" | "updatedAt">
  ): Prisma.UserCreateInput {
    return {
      email: domain.email,
      password: domain.password ?? null, // fallback if undefined
      authProvider: domain.authProvider,
      role: domain.role,
      providerId: domain.providerId ?? null, // fallback
      isBlocked: domain.isBlocked ?? false, // fallback
      isVerified: domain.isVerified ?? false, // fallback
      profileImage: domain.profileImage ?? null, // must match Prisma field name
      tokenVersion: 0,
    };
  }

  static toPersistanceUpdate(domain: Partial<IUser>): Prisma.UserUpdateInput {
    return {
      email: domain.email,
      password: domain.password ?? undefined,
      authProvider: domain.authProvider,
      role: domain.role,
      providerId: domain.providerId,
      isBlocked: domain.isBlocked,
      isVerified: domain.isVerified,
    };
  }
}
