import { AuthProvider } from "../../../domain/common/value-objects/AuthProvider";
import { Role } from "../../../domain/common/value-objects/Role";

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
