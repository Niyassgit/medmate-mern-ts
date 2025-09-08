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
