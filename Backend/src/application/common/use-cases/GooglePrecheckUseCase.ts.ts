import { JWTServices } from "../../../infrastructure/services/JwtService";
import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { GoogleAuthService } from "../../../infrastructure/services/GoogleAuthService";
import { GooglePrecheckResultDTO } from "../dto/GooglePrecheckResultDTO";

export class GooglePrecheckUseCase{
    constructor(
        private _userLoginRepository:IUserLoginRepository,
        private _googleAuthService:GoogleAuthService,
        private _jwtServices:JWTServices
    ){}


    async execute(idToken:string):Promise<GooglePrecheckResultDTO>{

        const {email}=await this._googleAuthService.verifyIdToken(idToken);

        if(!email) return {exists:false};

        const user=await this._userLoginRepository.findByEmail(email);
        if (!user) return { exists: false };

        const jwtPayload={id:user.id,role:user.role};
        const accessToken=await this._jwtServices.signAccessToken(jwtPayload);
        const refreshToken=await this._jwtServices.signRefreshToken(jwtPayload);

        return {exists:true,accessToken,refreshToken,user};
        }
}