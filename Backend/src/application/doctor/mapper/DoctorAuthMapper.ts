import { RegisterResponseDTO } from "../dto/RegisterResponseDTO";
import { IUser } from "../../../domain/common/entities/IUser";

export class DoctorAuthMapper {
  static toRegisterResponse(
    user: IUser,
    expiredAt?: Date
  ): RegisterResponseDTO {
    return {
      message: "Doctor registered successfully. Please verify your email.",
      email: user.email,
      role: user.role,
      loginId: user.id,
      isVerified: user.isVerified,
      expiredAt,
      otplength: 6,
    };
  }
}
