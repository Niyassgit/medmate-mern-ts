import { Role } from "../../../domain/common/entities/IUser";

export interface JwtPayload {
  id: string;
  role: Role;
  email?: string;
}
