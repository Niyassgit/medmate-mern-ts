import {prisma} from "../database/prismaClient";
import { IUserLoginRepository } from "../../domain/common/entities/IUserLoginRepository";
import { UserLogin } from "../../domain/common/entities/UserLogin";
import { UserLoginMapper } from "../mappers/UserLoginMapper";





export class UserLoginRepository implements IUserLoginRepository{

 async createUserLogin(data: Omit<UserLogin, "id" | "createdAt" | "updatedAt">): Promise<UserLogin> {
     const created=await prisma.userLogin.create({
        data:UserLoginMapper.toPersisitance(data),
     });
     return UserLoginMapper.toDomain(created);
 }

 async findByEmail(email: string): Promise<UserLogin | null> {
     const found=await prisma.userLogin.findUnique({where:{email}});
     return found ?UserLoginMapper.toDomain(found):null;
 }
}