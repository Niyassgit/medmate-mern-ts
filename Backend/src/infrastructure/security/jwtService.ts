import jwt from "jsonwebtoken";
import { JwtPayload } from "../../application/common/dto/JwtPayload";

const JWT_SECRET=process.env.JWT_SECRET || "supersecret";


export const jwtService ={

    generateToken:(payload:object) =>{
     return jwt.sign(payload,JWT_SECRET,{expiresIn:"7d"});
     
    },

    verifyToken :(token:string):JwtPayload=>{
        const decoded=jwt.verify(token,JWT_SECRET);
        return decoded as JwtPayload;
    }
}