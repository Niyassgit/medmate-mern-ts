import { Role } from "../../../domain/common/entities/IUserLogin";


export interface JwtPayload{
    id:string;
    role:Role;
    email?:string;
}