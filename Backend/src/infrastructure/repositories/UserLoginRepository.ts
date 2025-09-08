import { prisma } from "../database/PrismaClient";
import { IUserLoginRepository } from "../../domain/common/repositories/IUserLoginRepository";
import { IUserLogin, Role,AuthProvider} from "../../domain/common/entities/IUserLogin";
import { UserLoginMapper } from "../mappers/UserLoginMapper";


export class UserLoginRepository implements IUserLoginRepository {
  async createUserLogin(
    data: Omit<IUserLogin, "id" | "createdAt" | "updatedAt">
  ): Promise<IUserLogin> {
    const created = await prisma.userLogin.create({
      data: UserLoginMapper.toPersistence(data),
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


  async upsertGoogleUser(payload: { email: string; providerId: string | null; role: Role; }): Promise<IUserLogin> {

      const user = await prisma.userLogin.upsert({
      where: { email: payload.email },
      update: {
        providerId: payload.providerId ?? undefined,
        authProvider: AuthProvider.GOOGLE,
        isVerified: true,
      },
      create: {
        email: payload.email,
        providerId: payload.providerId ?? undefined,
        role: payload.role,
        authProvider: AuthProvider.GOOGLE,
        password: null,
        isVerified: true,
      },
    });

    return UserLoginMapper.toDomain(user);
    
  }
  async updateUser(userId: string, data: Partial<IUserLogin>): Promise<IUserLogin> {
      const user=await prisma.userLogin.update({
        where:{id:userId},
        data:{
          ...UserLoginMapper.toPersistanceUpdate(data),
        }
      });

      return UserLoginMapper.toDomain(user);
  }
}
