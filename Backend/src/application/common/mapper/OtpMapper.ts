import { ForgotResponseDTO } from "../dto/ForgotResponseDTO";

export class OtpMapper {
  static toForgotResponse(email: string, expiredAt?: Date): ForgotResponseDTO {
    return {
      email,
      message: "OTP sent to your registered email",
      expiredAt,
      otplength: 6,
    };
  }
}
