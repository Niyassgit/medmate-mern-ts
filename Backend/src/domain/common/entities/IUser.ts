export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  DOCTOR = "DOCTOR",
  MEDICAL_REP = "MEDICAL_REP",
}

export enum AuthProvider {
  NATIVE = "NATIVE",
  GOOGLE = "GOOGLE",
}

export interface IUser {
  id: string;
  email: string;
  password?: string | null;
  isBlocked: boolean;
  authProvider: AuthProvider;
  providerId?: string | null;
  isVerified: boolean;
  tokenVersion: number;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
