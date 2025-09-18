import { BadRequestError, NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { IOtpService } from "../../../domain/common/services/IOtpService";

export class VerifyForgotPasswordOtpUseCase{

    constructor(
        private _userLoginRepository:IUserRepository,
        private _bcryptService:IBcryptService,
        private _otpService:IOtpService
    ){}

    async execute(email:string,otp:string):Promise<string>{

        const user=await this._userLoginRepository.findByEmail(email);
        if(!user) throw new NotFoundError("User not found");
        
        const otpRecord=await this._otpService.findOtp(user.id,OtpPurpose.RESET_PASSWORD);
        if(!otpRecord) throw new NotFoundError("Invalid or expired OTP");
        if(otpRecord.expiredAt<new Date()) throw new BadRequestError("OTP expired");

        const matched=await this._bcryptService.compare(otp,otpRecord.otp);
        if(!matched) throw new BadRequestError("Invalid OTP");
         
        await this._otpService.deleteOtp(otpRecord.id,OtpPurpose.RESET_PASSWORD);
    return "Account verified successfully"

    }
}