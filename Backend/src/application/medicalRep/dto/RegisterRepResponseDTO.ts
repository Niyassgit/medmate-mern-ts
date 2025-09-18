export interface RegisterRepResponseDTO{
    message:string,
    email:string,
    role:string,
    loginId:string,
    isVerified:boolean,
    expiredAt?:Date,
    otplength:number,
}