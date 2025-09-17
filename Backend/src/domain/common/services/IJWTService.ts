import { JwtPayload,RefreshTokenPayload} from "../types/JwtPayload"

export interface IJWtService{
 
    signAccessToken(payload:JwtPayload):string;
    signRefreshToken(payload:RefreshTokenPayload):string;
    verifyAccessToken(token:string): JwtPayload | null;
    verifyRefreshToken(token:string): RefreshTokenPayload | null;

}