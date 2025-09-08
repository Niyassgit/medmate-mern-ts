import {
  Role,
  AuthProvider,
  IUserLogin,
} from "../../domain/common/entities/IUserLogin";
import { Prisma, UserLogin } from "@prisma/client";

export class UserLoginMapper {
  static toDomain(user: UserLogin): IUserLogin {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      authProvider: user.authProvider as AuthProvider,
      role: user.role as Role,
      isBlocked: user.isBlocked,
      isVerified: user.isVerified,
      providerId: user.providerId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toPersistence(
    domain: Omit<IUserLogin, "id" | "createdAt" | "updatedAt">
  ): Prisma.UserLoginCreateInput {
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
    domain :Partial<IUserLogin>
  ):Prisma.UserLoginUpdateInput{
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
