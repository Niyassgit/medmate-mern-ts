import { NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { INotificationService } from "../../../domain/common/services/INotificationService";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { OtpResponseDTO } from "../dto/OtpResponseDTO";
import { OtpMapper } from "../mapper/OtpMapper";

export class ResendOtpUseCase {
  constructor(
    private _userLoginRepository: IUserRepository,
    private _otpService: IOtpService,
    private _notificationService: INotificationService
  ) {}

  async execute(email: string): Promise<OtpResponseDTO> {
    const user = await this._userLoginRepository.findByEmail(email);
    if (!user) throw new NotFoundError("User not found");

    const { otp, otpRecord } = await this._otpService.updateOtp(
      user.id,
      OtpPurpose.SIGNUP
    );

    console.log("resend otp sended to user:", otp);
    this._notificationService
      .sendEmail(user.email, "Verify your account", `Your new OTP is ${otp}`)
      .catch((err) => console.error("Failed to send OTP email:", err));

    return OtpMapper.toForgotResponse(user.email, otpRecord.expiredAt);
  }
}
