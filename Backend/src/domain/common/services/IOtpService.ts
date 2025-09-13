import { IOtpRecord } from "../entities/IOtpRecord";
import { IResendOtpRecord } from "../entities/IResendOtpRecord";

export interface IOtpService{
     
    findOtp(userId:string):Promise<IOtpRecord | null>;
    deleteOtp(userId:string):Promise<void>;
    updateOtp(userId:string):Promise<IResendOtpRecord>
}