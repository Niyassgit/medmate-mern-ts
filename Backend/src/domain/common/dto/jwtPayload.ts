import { Role } from "../entities/UserLogin";


export interface JwtPayload{
    id:string;
    role:Role;
    email?:string;
}