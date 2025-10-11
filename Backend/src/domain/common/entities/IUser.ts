import { AuthProvider } from "../../../shared/enums"; 
import { Role } from "../../../shared/enums"; 

export interface IUser {
  id: string;
  email: string;
  password?: string | null;
  isBlocked: boolean;
  authProvider: AuthProvider;
  providerId?: string | null;
  profileImage?:string | null;
  isVerified: boolean;
  tokenVersion: number;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
