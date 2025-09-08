import { JWTServices } from "../../../infrastructure/services/JwtService";
import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { UnautharizedError } from "../../../domain/common/errors";
import { RefreshTokenPayload } from "../types/AuthPayload";

export  class GetNewAccessTokenUseCase{
    constructor(
        private _userLoginRepository:IUserLoginRepository,
        private _jwtService:JWTServices
    ){}

    async execute(refreshToken:string):Promise<string>{

        const decoded=this._jwtService.verifyRefreshToken(refreshToken);
        
       const user=await this._userLoginRepository.findById(decoded.id)  

        if(!user) throw new UnautharizedError("User not found");
       
        const jwtpayload={id:user.id,role:user.role};
        const newAccessToken=this._jwtService.signAccessToken(jwtpayload);

        return newAccessToken;
    }
}