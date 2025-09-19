import {
  IUser,
  AuthProvider,
  Role,
} from "../../../domain/common/entities/IUser";

export class UserMapper {
  static toUserEntity(
    email: string,
    hashedPassword: string,
    role: Role
  ): Omit<IUser, "id" | "createdAt" | "updatedAt"> {
    return {
      email,
      password: hashedPassword,
      isBlocked: false,
      authProvider: AuthProvider.NATIVE,
      role,
      isVerified: false,
      tokenVersion: 0,
    };
  }
}
