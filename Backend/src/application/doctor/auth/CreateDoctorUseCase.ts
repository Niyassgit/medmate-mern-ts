import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository"; 
import { RegisterResponseDTO } from "../dto/RegisterResponseDTO";
import { BcryptServices } from "../../../infrastructure/services/BcryptService"; 
import { RegisterDoctorDTO } from "../dto/RegisterDoctorDTO";
import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository"; 
import { AuthProvider,Role } from  "../../../domain/common/entities/IUserLogin"
import { ConflictError,BadRequestError } from "../../../domain/common/errors";
import { OtpService } from "../../../infrastructure/services/OtpService";
import { NotificationService } from "../../../infrastructure/services/NotificationService";

export class CreateDoctorUseCase{

    constructor(
        private _doctorRepository:IDoctorRepository,
        private _bcryptServices:BcryptServices,
        private _userLoginRepository:IUserLoginRepository,
        private _otpService:OtpService,
        private _notificationService:NotificationService
    ){}

    async execute(data:RegisterDoctorDTO):Promise<RegisterResponseDTO>{

        const userExist=await this._doctorRepository.getDoctorByEmail(data.email);
        if(userExist) throw new ConflictError(`User already exists`);
        
        if(!data.password) throw new BadRequestError("Password is requred for signup");

        const hashedPassword= await this._bcryptServices.hashValue(data.password);

        const login=await this._userLoginRepository.createUserLogin({
            email:data.email,
            password:hashedPassword,
            authProvider:AuthProvider.NATIVE,
            role:Role.DOCTOR,
            isBlocked:false,
            isVerified:false
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
   

        const {otp} =await this._otpService.generateOtp(login.id,"SIGNUP");
        console.log("otp sended to user:",otp);
        this._notificationService.sendEmail(
            data.email,
            "Veryfy your account",
            `Your OTP is ${otp}`
        );
        return {
            message:"Doctor registered successfully.Please verify your email.",
            email:login.email,
            role:login.role,
            loginId:login.id,
            isVerified:login.isVerified
        }

    }
}