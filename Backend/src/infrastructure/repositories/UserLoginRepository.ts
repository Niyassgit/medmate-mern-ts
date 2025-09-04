import { prisma } from "../database/PrismaClient";
import { IUserLoginRepository } from "../../domain/common/repositories/IUserLoginRepository";
import { IUserLogin } from "../../domain/common/entities/IUserLogin";
import { UserLoginMapper } from "../mappers/UserLoginMapper";

export class UserLoginRepository implements IUserLoginRepository {
  async createUserLogin(
    data: Omit<IUserLogin, "id" | "createdAt" | "updatedAt">
  ): Promise<IUserLogin> {
    const created = await prisma.userLogin.create({
      data: UserLoginMapper.toPersisitance(data),
    });
    return UserLoginMapper.toDomain(created);
  }

  async findByEmail(email: string): Promise<IUserLogin | null> {
    const found = await prisma.userLogin.findUnique({ where: { email } });
    return found ? UserLoginMapper.toDomain(found) : null;
  }
  async updateBlockStatus(
    userId: string,
    isBlocked: boolean
  ): Promise<IUserLogin | null> {
    const user = await prisma.userLogin.update({
      where: { id: userId },
      data: { isBlocked },
    });

    return user ? UserLoginMapper.toDomain(user) : null;
  }
}
