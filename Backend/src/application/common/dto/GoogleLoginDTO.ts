import { Role } from "../../../shared/enums";

interface User{
  id:string,
  role:Role,
  email:string
}

export interface GoogleLoginDTO {
  idToken: string;
  role: Role;
}
export interface reciveBody{
  idToken:string,
  user:User
}
