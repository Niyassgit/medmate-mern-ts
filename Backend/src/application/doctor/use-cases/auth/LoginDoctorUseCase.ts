import { IUserLoginRepository } from "../../../../domain/common/entities/IUserLoginRepository";
import { jwtService } from "../../../../infrastructure/security/jwtService";
import { BcryptServices } from "../../../../infrastructure/security/BcryptService";
import { AuthProvider,Role ,UserLogin} from "../../../../domain/common/entities/UserLogin";


export class LoginDoctorUseCase{

    constructor(
        private userLoginRepository:IUserLoginRepository,
        private bcryptServices:BcryptServices
    ){}

    async execute(email:string,password:string):Promise<{token:string,user:UserLogin}>{

        const user=await this.userLoginRepository.findByEmail(email);
        if(!user) throw new Error("Doctor not found");
        
        if(!user.password) throw new Error("Password not set");

        const isValid=await this.bcryptServices.comparePassword(password,user.password);
        if(!isValid) throw new Error("Invalid password");

        const token=jwtService.generateToken({
            id:user.id,
            role:user.role,
            email:user.email
        });
        console.log("the token is :",token)

     return {token,user}
    }
}

