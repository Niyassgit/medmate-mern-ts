import { prisma } from "../database/prisma";
import { IUserRepository } from "../../domain/common/repositories/IUserRepository";
import { IUser, Role, AuthProvider } from "../../domain/common/entities/IUser";
import { UserMapper } from "../mappers/UserMapper";

export class UserRepository implements IUserRepository {
  async createUser(
    data: Omit<IUser, "id" | "createdAt" | "updatedAt">
  ): Promise<IUser> {
    const created = await prisma.user.create({
      data: UserMapper.toPersistence(data),
    });
    return UserMapper.toDomain(created);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const found = await prisma.user.findUnique({ where: { email } });
    return found ? UserMapper.toDomain(found) : null;
  }

  async findById(userId: string): Promise<IUser | null> {
    const found = await prisma.user.findUnique({ where: { id: userId } });
    return found ? UserMapper.toDomain(found) : null;
  }
  async updateBlockStatus(
    userId: string,
    isBlocked: boolean
  ): Promise<IUser | null> {
    const user = await prisma.user.update({
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
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      const user = await prisma.user.update({
        where: { email: payload.email },
        data: {
          providerId: payload.providerId ?? undefined,
          authProvider: AuthProvider.GOOGLE,
          isVerified: true,
        },
      });
      return UserMapper.toDomain(user);
    }

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        providerId: payload.providerId ?? undefined,
        role: payload.role,
        authProvider: AuthProvider.GOOGLE,
        password: null,
        isVerified: true,
      },
    });

    return UserMapper.toDomain(user);
  }
  async updateUser(userId: string, isVerified: boolean): Promise<IUser | null> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async resetPassword(userId: string, password: string): Promise<string> {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: password,
      },
    });
    UserMapper.toDomain(updatedUser);
    return "Password reset successfully";
  }
  async updateProfileImage(userId: string, imageUrl: string): Promise<IUser | null> {
    const user=await prisma.user.update({
      where:{id:userId},
      data:{profileimage:imageUrl}
    })
    return user ? UserMapper.toDomain(user) : null;
  }
}
