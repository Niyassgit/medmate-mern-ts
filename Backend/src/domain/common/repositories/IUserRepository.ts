import { IUser } from "../entities/IUser";
import { Role } from "../../../shared/Enums";

export interface IUserRepository {
  createUser(
    data: Omit<IUser, "id" | "createdAt" | "updatedAt">
  ): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(userId: string): Promise<IUser | null>;
  updateBlockStatus(userId: string, isBlocked: boolean): Promise<IUser | null>;
  upsertGoogleUser(payload: {
    email: string;
    providerId: string | null;
    role: Role;
  }): Promise<IUser>;
  updateUser(userId: string, isVerified: boolean): Promise<IUser | null>;
  resetPassword(userId: string, password: string): Promise<boolean>;
  updateProfileImage(userId:string,imageUrl:string):Promise<IUser | null>;
}
