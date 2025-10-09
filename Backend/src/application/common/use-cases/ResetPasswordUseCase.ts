import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { BadRequestError, NotFoundError } from "../../../domain/common/errors";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { IResetPasswordUseCase } from "../interfaces/IResetPasswordUseCase";

export class ResetPasswordUseCase implements IResetPasswordUseCase{
  constructor(
    private _userLoginRepository: IUserRepository,
    private _otpService: IOtpService,
    private _bcryptService: IBcryptService
  ) {}

  async execute(email:string,password:string,otp:string): Promise<string> {
    const user = await this._userLoginRepository.findByEmail(email);
    if (!user) throw new NotFoundError("User not found");

    if (!user.password) throw new NotFoundError("User not found");
    const isMatchedPassword = await this._bcryptService.compare(
      password,
      user.password
    );
    if (isMatchedPassword)
      throw new BadRequestError(
        "New password cannot be the same as the old password"
      );

    const otpRecord = await this._otpService.findOtp(
      user.id,
      OtpPurpose.RESET_PASSWORD
    );
    if (!otpRecord) throw new BadRequestError("Ooops try again later");

    const matched = await this._bcryptService.compare(otp, otpRecord.otp);
    if (!matched)
      throw new BadRequestError(
        "The OTP you entered is invalid. Please try again"
      );

    const hashedPassword = await this._bcryptService.hash(password);
    await this._userLoginRepository.resetPassword(user.id, hashedPassword);
    await this._otpService.deleteOtp(user.id, OtpPurpose.RESET_PASSWORD);
    return "Password changed successfully";
  }
}
