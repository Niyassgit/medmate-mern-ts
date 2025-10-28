import { NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { INotificationService } from "../../../domain/common/services/INotificationService";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { OtpResponseDTO } from "../dto/OtpResponseDTO";
import { OtpMapper } from "../mapper/OtpMapper";
import { IResendOtpUseCase } from "../interfaces/IResendOtpUseCase";
import { ErrorMessages, NotificationMessages } from "../../../shared/Messages";

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private _userLoginRepository: IUserRepository,
    private _otpService: IOtpService,
    private _notificationService: INotificationService
  ) {}

  async execute(email: string): Promise<OtpResponseDTO> {
    const user = await this._userLoginRepository.findByEmail(email);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);

    const { otp, otpRecord } = await this._otpService.updateOtp(
      user.id,
      OtpPurpose.SIGNUP
    );
    
    console.log("resend otp sended to user:", otp);
    void this._notificationService.sendEmail(
      user.email,
      NotificationMessages.OTP_SUBJECT,
      NotificationMessages.NEW_OTP_VERIFICATION(otp)
    );

    return OtpMapper.toForgotResponse(user.email, otpRecord.expiredAt);
  }
}
