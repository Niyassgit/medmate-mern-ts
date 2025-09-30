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

export class ForgotPasswordUseCase {
  constructor(
    private _userLoginRepository: IUserRepository,
    private _otpService: IOtpService,
    private _notificationService: INotificationService
  ) {}

  async execute(email: string): Promise<ForgotResponseDTO> {
    const user = await this._userLoginRepository.findByEmail(email);
    if (!user) throw new NotFoundError("User not found");
    if (user.isBlocked) throw new ForbiddenError("User is blocked by admin");
    if (!user.isVerified) throw new UnautharizedError("User not verified");

    const { otp, record } = await this._otpService.generateOtp(
      user.id,
      OtpPurpose.RESET_PASSWORD
    );
    console.log("otp sent for reset password:", otp);

    this._notificationService
      .sendEmail(
        user.email,
        "Verify your account",
        `Your OTP for reset passsword is ${otp}`
      )
      .catch((err) => console.log("Failed to send OTP email:", err));

    return OtpMapper.toForgotResponse(user.email, record?.expiredAt);
  }
}
