import { prisma } from "../database/PrismaClient";
import { IUserRepository } from "../../domain/common/repositories/IUserLoginRepository";
import { IUser, Role,AuthProvider} from "../../domain/common/entities/IUserLogin";
import { UserLoginMapper } from "../mappers/UserLoginMapper";


export class UserRepository implements IUserRepository {
  async createUser(
    data: Omit<IUser, "id" | "createdAt" | "updatedAt">
  ): Promise<IUser> {
    const created = await prisma.userLogin.create({ 
      data: UserLoginMapper.toPersistence(data),
    });
    return UserLoginMapper.toDomain(created);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const found = await prisma.userLogin.findUnique({ where: { email } });
    return found ? UserLoginMapper.toDomain(found) : null;
  }

  async findById(userId: string): Promise<IUser | null> {
    const found =await prisma.userLogin.findUnique({where:{id:userId}});
    return found ? UserLoginMapper.toDomain(found) : null;
  }
  async updateBlockStatus(
    userId: string,
    isBlocked: boolean
  ): Promise<IUser | null> {
      const user = await prisma.userLogin.update({
      where: { id: userId },
      data: { isBlocked },
    });

    return user ? UserLoginMapper.toDomain(user) : null;
  }


  async upsertGoogleUser(payload: { email: string; providerId: string | null; role: Role; }): Promise<IUser> {

    const existingUser=await prisma.userLogin.findUnique({where:{email:payload.email}});

    if(existingUser){
      const user=await prisma.userLogin.update({
        where:{email:payload.email},
        data:{
          providerId:payload.providerId ?? undefined,
          authProvider:AuthProvider.GOOGLE,
          isVerified:true,
        }
      });
       return UserLoginMapper.toDomain(user);
    }

    const user=await prisma.userLogin.create({
      data:{
        email:payload.email,
        providerId:payload.providerId ?? undefined,
        role:payload.role,
        authProvider:AuthProvider.GOOGLE,
        password:null,
        isVerified:true

      }
    });

    return UserLoginMapper.toDomain(user);
    
  }
  async updateUser(userId: string, isVerified: boolean): Promise<IUser | null> {
    
    const user=await prisma.userLogin.update({
      where:{id:userId},
      data:{isVerified}
    });
    return user ?UserLoginMapper.toDomain(user) :null;
    

  }

  async resetPassword(userId: string,password:string): Promise<string>{
    const updatedUser=await prisma.userLogin.update({
      where:{id:userId},
      data:{
        password:password
      }
    });
   UserLoginMapper.toDomain(updatedUser);
   return "Password reset successfully"
  }

}
