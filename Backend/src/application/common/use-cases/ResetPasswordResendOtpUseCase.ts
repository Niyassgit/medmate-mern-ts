import { BadRequestError, NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { INotificationService } from "../../../domain/common/services/INotificationService";
import { OtpResponseDTO } from "../dto/OtpResponseDTO";
import { OtpMapper } from "../mapper/OtpMapper";

export class ResetPasswordResendOtpUseCase {
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
      OtpPurpose.RESET_PASSWORD
    );
    if (!otp) throw new BadRequestError("Retry later");
    console.log("otp recreated :", otp);

    void this._notificationService.sendEmail(
      user.email,
      "Verify your email",
      `Your new OTP is ${otp}`
    );

    return OtpMapper.toForgotResponse(user.email, otpRecord?.expiredAt);
  }
}
