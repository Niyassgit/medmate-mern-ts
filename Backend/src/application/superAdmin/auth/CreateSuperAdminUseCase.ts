import { ISuperAdminRepository } from "../../../domain/superAdmin/repositories/ISuperAdminRepository"; 
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { ISuperAdmin } from "../../../domain/superAdmin/entities/ISuperAdmin"; 
import { IUserRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { RegisterSuperAdminDTO } from "../dto/RegisterSuperAdminDTO"; 
import { AuthProvider,Role } from "../../../domain/common/entities/IUserLogin"; 
import { ConflictError,BadRequestError} from "../../../domain/common/errors";

export class CreateSuperAdminUseCase{
    constructor(
        private _superAdminRepository:ISuperAdminRepository,
        private _userLoginRepository:IUserRepository,
        private _bcryptServices:IBcryptService
    ){}

    async execute(data:RegisterSuperAdminDTO):Promise<ISuperAdmin>{
       
        const existAdmin=await this._superAdminRepository.getSuperAdminByEmail(data.email);
        if(existAdmin) throw new ConflictError(`User already exists`);

        if(!data.password){
             throw new BadRequestError("Password is Required for signup");
        }

        const hashedPassword= await this._bcryptServices.hash(data.password);

        const login =await this._userLoginRepository.createUser({
            email:data.email,
            password:hashedPassword,
            role:Role.SUPER_ADMIN,
            authProvider:AuthProvider.NATIVE,
            isBlocked:false,
            isVerified:false,
            tokenVersion:0
        });

        return this._superAdminRepository.createSuperAdmin({
            name:data.name,
            loginId:login.id,
            phone:data.phone
        })
    }
}