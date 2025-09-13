import { IOtpRecord } from "../entities/IOtpRecord";

export interface IOtpService{
     
    findOtp(userId:string):Promise<IOtpRecord | null>;
    deleteOtp(userId:string):Promise<void>;
}