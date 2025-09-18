import { IJWtService } from "../../../domain/common/services/IJWTService";
import { IUserRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { UnautharizedError } from "../../../domain/common/errors";


export  class GetNewAccessTokenUseCase{
    constructor(
        private _userLoginRepository:IUserRepository,
        private _jwtService:IJWtService
    ){}

    async execute(refreshToken:string):Promise<string>{

        const decoded=this._jwtService.verifyRefreshToken(refreshToken);
        if(!decoded) throw new UnautharizedError("Invalid refresh token");
       const user=await this._userLoginRepository.findById(decoded.userId)  

        if(!user) throw new UnautharizedError("User not found");
       
        const accessPayload={userId:user.id,role:user.role};
        const newAccessToken=this._jwtService.signAccessToken(accessPayload);

        return newAccessToken;
    }
}