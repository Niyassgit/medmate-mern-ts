import { Role } from "../../../domain/common/entities/IUserLogin"


export interface GoogleLoginDTO{
 idToken:string;
 role:Role;

}