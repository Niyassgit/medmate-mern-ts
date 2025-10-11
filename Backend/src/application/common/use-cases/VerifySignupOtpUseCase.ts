import { BadRequestError, NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { IVerifySignupOtpUseCase } from "../interfaces/IVerifySignupOtpUseCase";
import { ErrorMessages, SuccessMessages } from "../../../shared/messages";

export class VerifySignupOtpUseCase implements IVerifySignupOtpUseCase {
  constructor(
    private _userLoginRepository: IUserRepository,
    private _otpService: IOtpService,
    private _bcryptService: IBcryptService
  ) {}

  async execute(email: string, otp: string): Promise<string> {
    const user = await this._userLoginRepository.findByEmail(email);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);

    const otpRecord = await this._otpService.findOtp(
      user.id,
      OtpPurpose.SIGNUP
    );

    if (!otpRecord) throw new NotFoundError(ErrorMessages.OTP_INVALID);
    if (otpRecord.expiredAt < new Date())
      throw new BadRequestError(ErrorMessages.OTP_INVALID);

    const matched = await this._bcryptService.compare(otp, otpRecord.otp);
    if (!matched) throw new BadRequestError(ErrorMessages.OTP_INVALID);

    await this._userLoginRepository.updateUser(user.id, true);
    await this._otpService.deleteOtp(otpRecord.id, OtpPurpose.SIGNUP);

    return SuccessMessages.ACCOUNT_VERIFIED_SUCCESS;
  }
}
