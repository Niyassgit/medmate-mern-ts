export interface IOtpRecord{
    id:string,
    userId:string,
    otp:string,
    purpose:string,
    expiredAt:Date,
    createdAt:Date,
}