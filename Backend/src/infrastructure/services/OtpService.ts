import bcrypt from "bcryptjs"
import { prisma } from "../database/PrismaClient";

export class OtpService{


    async generateOtp(userId:string,purpose:"SIGNUP"| "RESET_PASSWORD"){
        
        const otp=Math.floor(100000 + Math.random() * 900000).toString();
        const hashed=await bcrypt.hash(otp,10);

        const record =await prisma.otpVerification.create({
            data:{
                userId,
                otp:hashed,
                purpose,
                expiredAt:new Date (Date.now() + 5+60*1000),
                createdAt:new Date()
            },
       
        })
     return {otp,record}
    }
}