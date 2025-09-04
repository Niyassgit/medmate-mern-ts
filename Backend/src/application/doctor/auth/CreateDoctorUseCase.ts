import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository"; 
import { IDoctor } from "../../../domain/doctor/entities/IDoctor"; 
import { BcryptServices } from "../../../infrastructure/services/BcryptService"; 
import { RegisterDoctorDTO } from "../dto/RegisterDoctorDTO";
import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository"; 
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
        if(userExist) throw new ConflictError(`User already exists`);
        
        if(!data.password) throw new BadRequestError("Password is requred for signup");

        const hashedPassword= await this._bcryptServices.hashPassword(data.password);

        const login=this._userLoginRepository.createUserLogin({
            email:data.email,
            password:hashedPassword,
            authProvider:AuthProvider.NATIVE,
            role:Role.DOCTOR,
            isBlocked:false,
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