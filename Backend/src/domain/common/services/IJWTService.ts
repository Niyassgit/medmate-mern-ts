import { JwtPayload,RefreshTokenPayload} from "../types/JwtPayload"

export interface IJWtService{
 
    signAccessToken(payload:JwtPayload):Promise<string>;
    signRefreshToken(payload:RefreshTokenPayload):Promise<string>;
    verifyAccessToken(token:string):Promise<JwtPayload | null>;
    verifyRefreshToken(token:string):Promise<RefreshTokenPayload | null>;

}