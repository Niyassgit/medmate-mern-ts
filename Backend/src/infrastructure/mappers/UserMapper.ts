import {
  Role as DomainRole,
  AuthProvider as DomainAuthProvider,
  IUser,
} from "../../domain/common/entities/IUser";

import { Prisma, User } from "@prisma/client";

export class UserMapper {

  static toDomain(user: User): IUser {
 
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      authProvider: user.authProvider as DomainAuthProvider,
      role: user.role as DomainRole,
      isBlocked: user.isBlocked,
      isVerified: user.isVerified,
      providerId: user.providerId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      tokenVersion:user.tokenVersion
    };
  }

  static toPersistence(
    domain: Omit<IUser, "id" | "createdAt" | "updatedAt">
  ): Prisma.UserCreateInput {
    return {
      email: domain.email,
      password: domain.password ?? undefined,
      authProvider: domain.authProvider,
      role: domain.role,
      providerId: domain.providerId,
      isBlocked: domain.isBlocked ?? false,
      isVerified: domain.isVerified ?? false,
    };
  }


  static toPersistanceUpdate(
    domain :Partial<IUser>
  ):Prisma.UserUpdateInput{
    return {

      email:domain.email,
      password:domain.password ?? undefined,
      authProvider:domain.authProvider,
      role:domain.role,
      providerId:domain.providerId,
      isBlocked:domain.isBlocked,
      isVerified:domain.isVerified
    }
  }
}
