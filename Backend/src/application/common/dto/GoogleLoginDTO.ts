import { Role } from "../../../domain/common/entities/IUser";

export interface GoogleLoginDTO {
  idToken: string;
  role: Role;
}
