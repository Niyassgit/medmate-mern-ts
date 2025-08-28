import { IUserLoginRepository } from "../../../domain/common/entities/IUserLoginRepository";
import { jwtService } from "../../../infrastructure/security/JwtService";
import { BcryptServices } from "../../../infrastructure/security/BcryptService";
import { IUserLogin} from "../../../domain/common/entities/IUserLogin";
import { NotFoundError ,BadRequestError,UnautharizedError} from "../../../domain/common/errors";

export class LoginDoctorUseCase{

    constructor(
        private _userLoginRepository:IUserLoginRepository,
        private _bcryptServices:BcryptServices
    ){}

    async execute(email:string,password:string):Promise<{token:string,user:IUserLogin}>{

        const user=await this._userLoginRepository.findByEmail(email);
        if(!user) throw new NotFoundError("Doctor not found");
        
        if(!user.password) throw new BadRequestError("Password is Required");

        const isValid=await this._bcryptServices.comparePassword(password,user.password);
        if(!isValid) throw new UnautharizedError("Invalid password");

        const token=jwtService.generateToken({
            id:user.id,
            role:user.role,
            email:user.email
        });

     return {token,user}
    }
}

