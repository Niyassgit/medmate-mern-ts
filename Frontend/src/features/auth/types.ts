
export interface User{
    id:string
    email:string,
    role:"DOCTOR"|"MEDICAL_REP" |"SUPER_ADMIN",
    image?:string
}

export interface AuthResponse{
    accessToken:string
    refreshToken:string
    user:User
}

export interface GooglePrecheckBody{
    exists:boolean,
    user:User
}
export interface RegisterResponseBody{
    success:boolean,
    message:string,
    email:string,
    role:string,
    loginId:boolean,
    isVerified:boolean,
    expiredAt:string,
    otplength:number

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
   message:string,
   expiredAt:string,
   otplength:number
}
