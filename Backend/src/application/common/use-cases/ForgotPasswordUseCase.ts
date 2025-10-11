import {
  ForbiddenError,
  NotFoundError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { INotificationService } from "../../../domain/common/services/INotificationService";
import { ForgotResponseDTO } from "../dto/ForgotResponseDTO";
import { OtpMapper } from "../mapper/OtpMapper";
import { IForgotPasswordUseCase } from "../interfaces/IForgotPasswordUseCase";
import { NotificationMessages, ErrorMessages } from "../../../shared/messages";

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    private _userLoginRepository: IUserRepository,
    private _otpService: IOtpService,
    private _notificationService: INotificationService
  ) {}

  async execute(email: string): Promise<ForgotResponseDTO> {
    const user = await this._userLoginRepository.findByEmail(email);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    if (user.isBlocked) throw new ForbiddenError(ErrorMessages.USER_BLOCKED);
    if (!user.isVerified) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const { otp, record } = await this._otpService.generateOtp(
      user.id,
      OtpPurpose.RESET_PASSWORD
    );
    console.log("otp sent for reset password:", otp);
 
      void this._notificationService
      .sendEmail(
        user.email,
        NotificationMessages.OTP_SUBJECT,
        NotificationMessages.OTP_RESET_PASSWORD(otp)
      )
    
    return OtpMapper.toForgotResponse(user.email, record?.expiredAt);
  }
}
