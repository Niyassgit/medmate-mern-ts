import { IUserLoginRepository } from "../../../domain/common/entities/IUserLoginRepository";
import { jwtService } from "../../../infrastructure/security/JwtService";
import { BcryptServices } from "../../../infrastructure/security/BcryptService";
import { UserLogin } from "../../../domain/common/entities/UserLogin";



export class  LoginMedicalRepUseCase{

    constructor(
        private _userLoginRepository:IUserLoginRepository,
        private _bcryptSercvices:BcryptServices
    ){}


    async execute(email:string,password:string):Promise<{token:string,user:UserLogin}>{

        const user=await this._userLoginRepository.findByEmail(email);
        if(!user) throw new Error("User not found");

        if(!user.password) throw new Error("Password not set");

        const isValid=await this._bcryptSercvices.comparePassword(password,user.password);
        if(!isValid) throw new Error("Invalid password");

        const token=jwtService.generateToken({
            id:user.id,
            role:user.role,
            email:user.email
        })

        return {token,user}
    }
}