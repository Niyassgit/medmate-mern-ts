export interface User{
    id:string
    email:string,
    role:"DOCTOR"|"MEDICAL_REP" |"SUPER_ADMIN"
}

export interface AuthResponse{
    accessToken:string
    refreshToken:string
    user:User
}

export interface GooglePrecheckBody{
    exists:boolean
}

export interface verifyResponse{
    success:string,
    message:string,
    expiredAt:string,
    otplength:number,
}

export interface ForgotPasswordResponse{
   success:boolean,
   email:string,
   message:string
}
