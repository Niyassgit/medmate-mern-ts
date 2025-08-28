import { jwtService } from "../../../infrastructure/security/JwtService";
import {Request,Response,NextFunction} from "express";
import { JwtPayload } from "../../../domain/common/dto/JwtPayload"; 

interface AuthenticatedRequest extends Request {
    user?:JwtPayload;
}

export const AuthMiddleware =(
    req:AuthenticatedRequest,
    res:Response,
    next:NextFunction
)=>{
    const token=req.headers['authorization']?.split(" ")[1];

    if(!token) return res.status(400).json({message:"Unautharized"});

    try {
        const decoded=jwtService.verifyToken(token);
        req.user=decoded;
        next();
    } catch (error) {
        return res.status(403).json({message:"Invalid token",error})
    }
}