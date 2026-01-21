import { IUser } from "../../../domain/common/entities/IUser";
import { AuthProvider, Role } from "../../../shared/Enums";
import { UserProfileDTO } from "../dto/UserProfileDTO";
import { AuthUserDTO } from "../dto/AuthUserDTO";

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

  static toUserProfile(
    user: IUser,
    profileImageUrl: string | null
  ): UserProfileDTO {
    return {
      id: user.id,
      email: user.email,
      profileImage: profileImageUrl,
      role: user.role,
    };
  }

  static toAuthUser(user: IUser, profileImageUrl: string | null): AuthUserDTO {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      image: profileImageUrl,
    };
  }
}

