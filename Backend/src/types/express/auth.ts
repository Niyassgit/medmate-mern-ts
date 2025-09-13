export interface JwtPayload {
    id:string
    email:string
    role:string
}

export interface Cookie{
    refreshtoken?:string
}

export interface PreCheckRequestBody {
  idToken: string;
}

export interface VerifyOtpBody{
  email:string,
  otp:string
}
export interface resendOtpBody{
    email:string;
}