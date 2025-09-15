import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository"; 
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository"; 
import { AuthProvider,Role } from "../../../domain/common/entities/IUserLogin"; 
import { RegisterMedicalRepDTO } from "../dto/RegisterMedicalRepDTO"; 
import { ConflictError,BadRequestError } from "../../../domain/common/errors";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { INotificationService } from "../../../domain/common/services/INotificationService";
import { RegisterRepResponseDTO } from "../dto/RegisterRepResponseDTO";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";

export class CreateMedicalRepUseCase{
 
    constructor(private _medicalRepRepository:IMedicalRepRepository,
      private _bcryptServices: IBcryptService, 
      private _userLoginRepository:IUserLoginRepository,
      private _otpService:IOtpService,
      private _notificationService:INotificationService
    
    ){}
    
    async execute(data:RegisterMedicalRepDTO):Promise <RegisterRepResponseDTO>{

      const existingRep=await this._medicalRepRepository.getMedicalRepByEmail(data.email);
      if(existingRep){
        throw new ConflictError(`User already exists`);
      }

      if(!data.password){
        throw new BadRequestError("Password is required for signup");
      }
      const hashedPassword=await this._bcryptServices.hash(data.password);
      
      const login=await this._userLoginRepository.createUserLogin({
        email:data.email,
        password:hashedPassword,
        role:Role.MEDICAL_REP,
        authProvider:AuthProvider.NATIVE,
        isBlocked:false,
        isVerified:false,
        tokenVersion:0
      });


      await this._medicalRepRepository.createMedicalRep({
        name:data.name,
        phone:data.phone,
        companyName:data.companyName,
        companyLogoUrl:data.companyLogoUrl ?? null,
        employeeId:data.employeeId,
        subscriptionStatus:false,
        maxConnectionsPerDay:10,
        loginId:login.id,
        
      });

      const {otp}=await this._otpService.generateOtp(login.id,OtpPurpose.SIGNUP);
      console.log("otp sended from rep register:",otp)
      this._notificationService.sendEmail(
        data.email,
        "Verify your account",
         `Your OTP is ${otp}`
      )  .catch(err => console.error("Failed to send OTP email:", err));
      return {
        message:"User registerd successfully.Please verify your email",
        email:login.email,
        role:login.role,
        isVerified:login.isVerified,
        loginId:login.id
      }
    
}
}