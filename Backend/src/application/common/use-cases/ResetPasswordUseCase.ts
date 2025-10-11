import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { BadRequestError, NotFoundError } from "../../../domain/common/errors";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { IResetPasswordUseCase } from "../interfaces/IResetPasswordUseCase";
import { ErrorMessages, SuccessMessages } from "../../../shared/messages";

export class ResetPasswordUseCase implements IResetPasswordUseCase{
  constructor(
    private _userLoginRepository: IUserRepository,
    private _otpService: IOtpService,
    private _bcryptService: IBcryptService
  ) {}

  async execute(email:string,password:string,otp:string): Promise<string> {
    const user = await this._userLoginRepository.findByEmail(email);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);

    if (!user.password) throw new NotFoundError(ErrorMessages.PASSWORD_REQUIRED);
    const isMatchedPassword = await this._bcryptService.compare(
      password,
      user.password
    );
    if (isMatchedPassword) throw new BadRequestError(ErrorMessages.PASSWORD_CANT_SAME);

    const otpRecord = await this._otpService.findOtp(
      user.id,
      OtpPurpose.RESET_PASSWORD
    );
    if (!otpRecord) throw new BadRequestError(ErrorMessages.RETRY_LATER);
    const matched = await this._bcryptService.compare(otp, otpRecord.otp);
    if (!matched)
      throw new BadRequestError(ErrorMessages.OTP_INVALID);

    const hashedPassword = await this._bcryptService.hash(password);
    const success=await this._userLoginRepository.resetPassword(user.id, hashedPassword);
    if(!success) throw new BadRequestError(ErrorMessages.PASS_RESET_FAILED);
    await this._otpService.deleteOtp(user.id, OtpPurpose.RESET_PASSWORD);
    return SuccessMessages.PASSWORD_RESET_SUCCESS;
  }
}
