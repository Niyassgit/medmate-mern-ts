import { Role } from "../../../shared/Enums";

export interface JwtPayload {
  id: string;
  role: Role;
  email?: string;
}
