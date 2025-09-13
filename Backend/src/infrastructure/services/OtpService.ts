import bcrypt from "bcryptjs"
import { prisma } from "../database/PrismaClient";
import { IOtpService } from "../../domain/common/services/IOtpService";
import { IOtpRecord } from "../../domain/common/entities/IOtpRecord";

export class OtpService implements IOtpService{


    async generateOtp(userId:string,purpose:"SIGNUP"| "RESET_PASSWORD"){
        
        const otp=Math.floor(100000 + Math.random() * 900000).toString();
        const hashed=await bcrypt.hash(otp,6);
        const record =await prisma.otpVerification.create({
            data:{
                userId,
                otp:hashed,
                purpose,
                expiredAt:new Date (Date.now() + 1*60*1000),
                createdAt:new Date()
            },
       
        })
     return {otp,record}
    }

    async findOtp(userId: string): Promise<IOtpRecord> {
        const otpRecord=await prisma.otpVerification.findFirst({where:{userId},orderBy:{createdAt:"desc"}});
         if(!otpRecord) throw new Error("OTP not found");
         return otpRecord;
    }

    async deleteOtp(userId: string): Promise<void> {
        const otpRecord=await prisma.otpVerification.findFirst({where:{userId:userId},orderBy:{createdAt:"desc"}});
        if(otpRecord){
            await prisma.otpVerification.delete({
                where:{id:otpRecord.id}
            })
        }
    }
}