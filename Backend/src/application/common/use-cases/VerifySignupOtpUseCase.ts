import { BadRequestError, NotFoundError } from "../../../domain/common/errors";
import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { OtpResponseDTO } from "../dto/OtpResponseDTO";

export class VerifySignupOtpUseCase{

    constructor(
        private _userLoginRepository:IUserLoginRepository,
        private _otpService:IOtpService,
        private _bcryptService:IBcryptService
    ){}

    async execute(email:string,otp:string):Promise<string>{
        
       const user=await this._userLoginRepository.findByEmail(email);
       if(!user) throw new NotFoundError("User not Found")
        
       const otpRecord=await this._otpService.findOtp(user.id,OtpPurpose.SIGNUP);

       if(!otpRecord) throw new NotFoundError("Invalid or expired OTP");
       if(otpRecord.expiredAt< new Date()) throw new BadRequestError("OTP expired");

       const matched=await this._bcryptService.compare(otp,otpRecord.otp);
       if(!matched) throw new BadRequestError("Invalid OTP");
   

       await this._userLoginRepository.updateUser(user.id,true);
       await this._otpService.deleteOtp(otpRecord.id,OtpPurpose.SIGNUP);
 
       return "Account verified successfully"
    }

}