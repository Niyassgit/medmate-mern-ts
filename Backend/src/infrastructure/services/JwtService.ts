import jwt from "jsonwebtoken";


export class JWTServices{
     
    private accessToken=process.env.ACCESS_TOKEN!;
    private refreshToken=process.env.REFRESH_TOKEN!;

    signAccessToken(payload:object){
        return jwt.sign(payload,this.accessToken,{expiresIn:"15m"});
    }

    signRefreshToken(payload:object){
        return jwt.sign(payload,this.refreshToken,{expiresIn:"7d"})
    }

    verifyAccessToken(token:string){
        return jwt.sign(token,this.accessToken);
    }
    verifyRefreshToken(token:string){
        return jwt.sign(token,this.refreshToken);
    }
}