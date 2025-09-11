import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository"; 
import { BcryptServices } from "../../../infrastructure/services/BcryptService";  
import { IMedicalRep } from "../../../domain/medicalRep/entities/IMedicalRep";  
import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository"; 
import { AuthProvider,Role } from "../../../domain/common/entities/IUserLogin"; 
import { RegisterMedicalRepDTO } from "../dto/RegisterMedicalRepDTO"; 
import { ConflictError,BadRequestError } from "../../../domain/common/errors";
import { OtpService } from "../../../infrastructure/services/OtpService";
import { NotificationService } from "../../../infrastructure/services/NotificationService";

export class CreateMedicalRepUseCase{
 
    constructor(private _medicalRepRepository:IMedicalRepRepository,
      private _bcryptServices: BcryptServices, 
      private _userLoginRepository:IUserLoginRepository,
      private _otpService:OtpService,
      private _notificationService:NotificationService
    
    ){}
    
    async execute(data:RegisterMedicalRepDTO):Promise <IMedicalRep>{

      const existingRep=await this._medicalRepRepository.getMedicalRepByEmail(data.email);
      if(existingRep){
        throw new ConflictError(`User already exists`);
      }

      if(!data.password){
        throw new BadRequestError("Password is required for signup");
      }
      const hashedPassword=await this._bcryptServices.hashPassword(data.password);
      
      const login=await this._userLoginRepository.createUserLogin({
        email:data.email,
        password:hashedPassword,
        role:Role.MEDICAL_REP,
        authProvider:AuthProvider.NATIVE,
        isBlocked:false,
        isVerified:false,
      });


      const rep=await this._medicalRepRepository.createMedicalRep({
        name:data.name,
        phone:data.phone,
        companyName:data.companyName,
        companyLogoUrl:data.companyLogoUrl ?? null,
        employeeId:data.employeeId,
        subscriptionStatus:false,
        maxConnectionsPerDay:10,
        loginId:login.id,
        
      });

      const {otp}=await this._otpService.generateOtp(login.id,"SIGNUP");
      await this._notificationService.sendEmail(
        data.email,
        "Veryfy your account",
         `Your OTP is ${otp}`
      )
      return rep;
    
}
}