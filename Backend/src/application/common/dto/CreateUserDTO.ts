import { AuthProvider, Role } from "../../../shared/Enums";

export interface CreateUserDTO {
  email: string;
  password?: string | null;
  isBlocked: boolean;
  authProvider: AuthProvider;
  providerId?: string | null;
  profileImage?: string | null;
  isVerified: boolean;
  tokenVersion: number;
  role: Role;
}
