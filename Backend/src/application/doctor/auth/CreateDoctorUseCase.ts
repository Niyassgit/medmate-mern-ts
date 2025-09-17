import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository"; 
import { RegisterResponseDTO } from "../dto/RegisterResponseDTO";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { RegisterDoctorDTO } from "../dto/RegisterDoctorDTO";
import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository"; 
import { AuthProvider,Role } from  "../../../domain/common/entities/IUserLogin"
import { ConflictError,BadRequestError } from "../../../domain/common/errors";
import { INotificationService } from "../../../domain/common/services/INotificationService";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { IOtpService } from "../../../domain/common/services/IOtpService";

export class CreateDoctorUseCase{

    constructor(
        private _doctorRepository:IDoctorRepository,
        private _bcryptServices:IBcryptService,
        private _userLoginRepository:IUserLoginRepository,
        private _otpService:IOtpService,
        private _notificationService:INotificationService
    ){}

    async execute(data:RegisterDoctorDTO):Promise<RegisterResponseDTO>{

        const userExist=await this._doctorRepository.getDoctorByEmail(data.email);
        if(userExist) throw new ConflictError(`User already exists`);
        
        if(!data.password) throw new BadRequestError("Password is requred for signup");

        const hashedPassword= await this._bcryptServices.hash(data.password);

        const login=await this._userLoginRepository.createUserLogin({
            email:data.email,
            password:hashedPassword,
            authProvider:AuthProvider.NATIVE,
            role:Role.DOCTOR,
            isBlocked:false,
            isVerified:false,
            tokenVersion:0
        });

        await this._doctorRepository.createDoctor({
            name:data.name,
            phone:data.phone,
            departmentId:data.departmentId,
            territoryId:data.territoryId,
            hospital:data.hospital,
            registrationId:data.registrationId,
            licenseImageUrl:data.licenseImageUrl,
            opHours:data.opHours,
            hasOwnClinic:data.hasOwnClinic,
            loginId:login.id,
        
        });
   

        const {otp,record} =await this._otpService.generateOtp(login.id,OtpPurpose.SIGNUP);
        console.log("otp sended to user:",otp);
        this._notificationService.sendEmail(
            data.email,
            "Veryfy your account",
            `Your OTP is ${otp}`
        )
          .catch(err => console.error("Failed to send OTP email:", err));

        return {
            message:"Doctor registered successfully.Please verify your email.",
            email:login.email,
            role:login.role,
            loginId:login.id,
            isVerified:login.isVerified,
            expiredAt:record?.expiredAt,
            otplength:6

        }

    }
}