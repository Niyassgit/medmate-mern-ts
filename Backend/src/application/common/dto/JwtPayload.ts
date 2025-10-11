import { Role } from "../../../shared/enums";

export interface JwtPayload {
  id: string;
  role: Role;
  email?: string;
}
