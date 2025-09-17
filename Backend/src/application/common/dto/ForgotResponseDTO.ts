export interface ForgotResponseDTO{
    email:string,
    message:string,
    expiredAt?:Date,
    otplength:number
}