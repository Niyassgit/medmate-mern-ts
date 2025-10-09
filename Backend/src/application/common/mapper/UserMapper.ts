import { IUser } from "../../../domain/common/entities/IUser";
import { AuthProvider } from "../../../domain/common/value-objects/AuthProvider";
import { Role } from "../../../domain/common/value-objects/Role";
import { UserProfileDTO } from "../dto/UserProfileDTO";

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

  static toUserProfile(user: IUser): UserProfileDTO {
    return {
      id: user.id,
      email: user.email,
      profileImage: user.profileImage ?? null,
      role: user.role,
    };
  }
}
