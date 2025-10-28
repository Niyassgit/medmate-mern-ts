import { prisma } from "../database/prisma";
import { IUserRepository } from "../../domain/common/repositories/IUserRepository";
import { IUser } from "../../domain/common/entities/IUser";
import { AuthProvider,Role } from "../../shared/Enums";
import { UserMapper } from "../mappers/UserMapper";
import { BaseRepository } from "../database/BaseRepository";
import { User,Prisma } from "@prisma/client";

export class UserRepository
  extends BaseRepository<IUser, User,Prisma.UserCreateInput, "user">
  implements IUserRepository
{
  constructor() {
    super(prisma.user,(user)=> UserMapper.toDomain(user));
  }

  async createUser(
    data: Omit<IUser, "id" | "createdAt" | "updatedAt">
  ): Promise<IUser> {
    const mappedData = UserMapper.toPersistence(data);
    const created = await this.create(mappedData);
    return created; 
  }

   async findByEmail(email: string): Promise<IUser | null> {
    const entity = await this.model.findUnique({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findById(userId: string) {
  const entity = await this.model.findUnique({ where: { id: userId } });
  return entity ? this.toDomain(entity) : null;
}

  async updateBlockStatus(
    userId: string,
    isBlocked: boolean
  ): Promise<IUser | null> {
    const user = await this.model.update({
      where: { id: userId },
      data: { isBlocked },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async upsertGoogleUser(payload: {
    email: string;
    providerId: string | null;
    role: Role;
  }): Promise<IUser> {
    const existingUser = await this.model.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      const user = await this.model.update({
        where: { email: payload.email } as Partial<User>,
        data: {
          providerId: payload.providerId ?? undefined,
          authProvider: AuthProvider.GOOGLE,
          isVerified: true,
        },
      });
      return UserMapper.toDomain(user);
    }

    const user = await this.model.create({
      data: {
        email: payload.email,
        providerId: payload.providerId ?? undefined,
        role: payload.role,
        authProvider: AuthProvider.GOOGLE,
        password: null,
        isVerified: true,
      } as Partial<User>,
    });

    return UserMapper.toDomain(user);
  }
  async updateUser(userId: string, isVerified: boolean): Promise<IUser | null> {
    return await this.update(userId,{isVerified});
  }

  async resetPassword(userId: string, password: string): Promise<boolean> {
    const updatedUser = await this.model.update({
      where: { id: userId },
      data: {
        password: password,
      },
    });
    return updatedUser ?true:false;
  }
  async updateProfileImage(
    userId: string,
    imageUrl: string
  ): Promise<IUser | null> {
    const user = await this.model.update({
      where: { id: userId },
      data: { profileImage: imageUrl },
    });
    return user ? UserMapper.toDomain(user) : null;
  }
}
