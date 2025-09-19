import { IUser } from "../../../domain/common/entities/IUser";
import { RegisterRepResponseDTO } from "../dto/RegisterRepResponseDTO";

export class MedicalRepAuthMapper {
  static toRegisterResponse(
    user: IUser,
    expiredAt?: Date
  ): RegisterRepResponseDTO {
    return {
      message: "User registerd successfully.Please verify your email",
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      loginId: user.id,
      expiredAt,
      otplength: 6,
    };
  }
}
