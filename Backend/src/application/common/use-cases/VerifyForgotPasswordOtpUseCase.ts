import { BadRequestError, NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { IVerifyForgotPasswordOtpUseCase } from "../interfaces/IVerifiyForgotPasswordOtpUseCase";
import { ErrorMessages, SuccessMessages } from "../../../shared/messages";

export class VerifyForgotPasswordOtpUseCase implements IVerifyForgotPasswordOtpUseCase {
  constructor(
    private _userLoginRepository: IUserRepository,
    private _bcryptService: IBcryptService,
    private _otpService: IOtpService
  ) {}

  async execute(email: string, otp: string): Promise<string> {
    const user = await this._userLoginRepository.findByEmail(email);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);

    const otpRecord = await this._otpService.findOtp(
      user.id,
      OtpPurpose.RESET_PASSWORD
    );
    if (!otpRecord) throw new NotFoundError(ErrorMessages.OTP_INVALID);
    if (otpRecord.expiredAt < new Date())
      throw new BadRequestError(ErrorMessages.OTP_INVALID);

    const matched = await this._bcryptService.compare(otp, otpRecord.otp);
    if (!matched) throw new BadRequestError(ErrorMessages.OTP_INVALID);

    await this._otpService.deleteOtp(otpRecord.id, OtpPurpose.RESET_PASSWORD);
    return SuccessMessages.ACCOUNT_VERIFIED_SUCCESS;
  }
}
