import { NotFoundError } from "../../../domain/common/errors";
import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { OtpService } from "../../../infrastructure/services/OtpService";
import { NotificationService } from "../../../infrastructure/services/NotificationService";

export class ResendOtpUseCase {
  constructor(
    private _userLoginRepository: IUserLoginRepository,
    private _otpService: OtpService,
    private _notificationService: NotificationService
  ) {}

  async execute(email: string): Promise<string> {
    const user = await this._userLoginRepository.findByEmail(email);
    if (!user) throw new NotFoundError("User not found");

 
    const {otp}=await this._otpService.updateOtp(user.id);
       
    console.log("resend otp sended to user:", otp);
    this._notificationService.sendEmail(
      user.email,
      "Verify your account",
      `Your new OTP is ${otp}`
    )
      .catch(err => console.error("Failed to send OTP email:", err));;

    return "OTP resent successfully"
  }
}
