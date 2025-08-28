import { IDoctorRepository } from "../../../domain/doctor/entities/IDoctorRepository"; 
import { IDoctor } from "../../../domain/doctor/entities/IDoctor"; 
import { BcryptServices } from "../../../infrastructure/security/BcryptService"; 
import { RegisterDoctorDTO } from "../../../domain/doctor/dto/RegisterDoctorDTO";
import { IUserLoginRepository } from "../../../domain/common/entities/IUserLoginRepository"; 
import { AuthProvider,Role } from  "../../../domain/common/entities/IUserLogin"
import { ConflictError,BadRequestError } from "../../../domain/common/errors";
export class CreateDoctorUseCase{

    constructor(
        private _doctorRepository:IDoctorRepository,
        private _bcryptServices:BcryptServices,
        private _userLoginRepository:IUserLoginRepository
    ){}

    async execute(data:RegisterDoctorDTO):Promise<IDoctor>{

        const userExist=await this._doctorRepository.getDoctorByEmail(data.email);
        if(userExist) throw new Error(`Doctor with ${data.email} already exist`);
        
        if(!data.password) throw new BadRequestError("Password is requred for signup");

        const hashedPassword= await this._bcryptServices.hashPassword(data.password);

        const login=this._userLoginRepository.createUserLogin({
            email:data.email,
            password:hashedPassword,
            authProvider:AuthProvider.NATIVE,
            role:Role.DOCTOR
        });

        return this._doctorRepository.createDoctor({
            name:data.name,
            phone:data.phone,
            departmentId:data.departmentId,
            territoryId:data.territoryId,
            hospitalId:data.hospitalId,
            registrationId:data.registrationId,
            licenseImageUrl:data.licenseImageUrl,
            opHours:data.opHours,
            hasOwnClinic:data.hasOwnClinic,
            loginId:(await login).id,
        
        });
    }
}