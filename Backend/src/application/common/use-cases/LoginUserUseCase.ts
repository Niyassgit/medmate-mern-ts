import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { IUserLogin} from "../../../domain/common/entities/IUserLogin";
import { BcryptServices } from "../../../infrastructure/services/BcryptService";
import { JWTServices } from "../../../infrastructure/services/JwtService";
import { UnautharizedError,BadRequestError,ForbiddenError} from "../../../domain/common/errors";

export class LoginUserUseCase{

    constructor(
        private _userLoginRepository:IUserLoginRepository,
        private _bcryptServices:BcryptServices,
        private _jwtServices:JWTServices
    ){}

   async execute(email:string,password:string):Promise<{accessToken:string,refreshToken:string,user:IUserLogin}>{
  
     const user=await this._userLoginRepository.findByEmail(email);
     if(!user) throw new UnautharizedError("User not found");
     
     if(!user.password) throw new BadRequestError("Password is required");
     const isValidUser=await this._bcryptServices.compareValue(password,user.password);
     if(!isValidUser) throw new UnautharizedError("Invalid password");
     if(user.isBlocked) throw new ForbiddenError("User is blocked");
     if(!user.isVerified) throw new ForbiddenError("Please verify email before logging in");

     const payload={id:user.id,role:user.role};
     const accessToken=this._jwtServices.signAccessToken(payload);
     const refreshToken=this._jwtServices.signRefreshToken(payload);

    return {accessToken,refreshToken,user};
   }
}