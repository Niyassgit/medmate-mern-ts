import jwt from "jsonwebtoken";
import { IJWtService } from "../../domain/common/services/IJWTService";
import { JwtPayload,RefreshTokenPayload} from "../../domain/common/types/JwtPayload";

export class JWTServices implements IJWtService{
     
    private accessSecret=process.env.ACCESS_TOKEN!;
    private refreshSecret=process.env.REFRESH_TOKEN!;

   async signAccessToken(payload: JwtPayload): Promise<string> {
       return jwt.sign(payload,this.accessSecret,{expiresIn:"15m"})
   }
   async signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
       return jwt.sign(payload,this.refreshSecret,{expiresIn:"7d"});
   }
   async verifyAccessToken(token: string): Promise<JwtPayload | null> {
       try {
        return jwt.verify(token,this.accessSecret) as JwtPayload;
       } catch (error) {
        return null;
       }
   }

   async verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
       try {
        return jwt.verify(token,this.refreshSecret) as RefreshTokenPayload
       } catch (error) {
        return null;
       }
   }
}