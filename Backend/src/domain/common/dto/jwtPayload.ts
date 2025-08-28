import { Role } from "../entities/IUserLogin";


export interface JwtPayload{
    id:string;
    role:Role;
    email?:string;
}