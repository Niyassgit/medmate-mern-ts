import { IUserLoginRepository } from "../../../domain/common/entities/IUserLoginRepository";
import { jwtService } from "../../../infrastructure/security/JwtService";
import { BcryptServices } from "../../../infrastructure/security/BcryptService";
import { IUserLogin } from "../../../domain/common/entities/IUserLogin";
import { UnautharizedError,BadRequestError } from "../../../domain/common/errors";

export class LoginSuperAdminUseCase{

    constructor(
        private _userLoginRepository:IUserLoginRepository,
        private _bcryptService:BcryptServices
    ){}

    async  execute(email:string,password:string):Promise<{token:string,user:IUserLogin}>{

        const user=await this._userLoginRepository.findByEmail(email);
        if(!user) throw new UnautharizedError("Admin not found");
        if(!user.password) throw new BadRequestError("Password is required");

        const isValid=await this._bcryptService.comparePassword(password,user.password);

        if(!isValid) throw new UnautharizedError("Invalid password");
        const token=jwtService.generateToken({
            id:user.id,
            role:user.role,
            email:user.email
        });

        return {token,user};
    } 
}