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
