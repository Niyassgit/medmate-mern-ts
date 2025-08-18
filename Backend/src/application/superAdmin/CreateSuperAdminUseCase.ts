import { ISuperAdminRepository } from "../../domain/superAdmin/entities/ISuperAdminRepository";
import { BcryptServices } from "../../infrastructure/security/BcryptService";
import { SuperAdmin} from "../../domain/superAdmin/entities/superAdmin";
import { UserLogin } from "../../domain/common/entities/UserLogin";
import { UserLoginRepository } from "../../infrastructure/repositories/UserLoginRepository";
import { RegisterSuperAdminDTO } from "../../domain/superAdmin/dto/RegisterSuperAdminDTO";
import { AuthProvider,Role } from "../../domain/common/entities/UserLogin";

export class CreateSuperAdminUseCase{
    constructor(
        private superAdminRepository:ISuperAdminRepository,
        private userLoginRepository:UserLoginRepository,
        private bcryptServices:BcryptServices
    ){}

    async execute(data:RegisterSuperAdminDTO):Promise<SuperAdmin>{
       
        const existAdmin=await this.superAdminRepository.getSuperAdminByEmail(data.email);
        if(existAdmin) throw new Error(`Admin with ${data.email} already exist`);

        if(!data.password){
             throw new Error("Password is Required for signup");
        }

        let hashedPassword= await this.bcryptServices.hashPassword(data.password);

        const login =await this.userLoginRepository.createUserLogin({
            email:data.email,
            password:hashedPassword,
            role:Role.SUPER_ADMIN,
            authProvider:AuthProvider.NATIVE,
        });

        return this.superAdminRepository.createSuperAdmin({
            name:data.name,
            loginId:login.id,
            phone:data.phone
        })
    }
}