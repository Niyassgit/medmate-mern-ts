import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { BadRequestError, NotFoundError } from "../../../domain/common/errors";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";

export class ResetPasswordUseCase{
    constructor(
        private _userLoginRepository:IUserLoginRepository,
        private _otpService:IOtpService,
        private _bcryptService:IBcryptService

    ){}

    async execute(email:string,otp:string,password:string):Promise<string>{

        const user=await this._userLoginRepository.findByEmail(email);
        if(!user) throw new NotFoundError("User not found");

        const otpRecord=await this._otpService.findOtp(user.id,OtpPurpose.RESET_PASSWORD);
        if(!otpRecord) throw new BadRequestError("OTP expired");

        const matched=await this._bcryptService.compare(otp,otpRecord.otp);
        if(!matched) throw new BadRequestError("Invalid or expired OTP");
       
        const hashedPassword=await this._bcryptService.hash(password);
        await this._userLoginRepository.resetPassword(user.id,hashedPassword);
        await this._otpService.deleteOtp(user.id,OtpPurpose.RESET_PASSWORD);
        return "Password changed successfully";
    }
}