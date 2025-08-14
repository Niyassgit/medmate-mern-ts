import {Role,AuthProvider,UserLogin} from "../../domain/common/entities/UserLogin";
import { Prisma } from "@prisma/client";


export class UserLoginMapper{

  static toDomain(user:any):UserLogin{

    return {

        id:user.id,
        email:user.email,
        password:user.password,
        authProvider:user.authProvider ? user.authProvider as AuthProvider : null,
        role:user.role as Role,
        providerId:user.providerId,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt,
    }
  }

    static toPersisitance(domain:Omit<UserLogin, "id" | "createdAt" | "updatedAt">) : Prisma.UserLoginCreateInput{

        return {
            email:domain.email,
            password:domain.password ?? undefined,
            authProvider:domain.authProvider as AuthProvider,
            role:domain.role,
            providerId:domain.providerId,
        }
    }
}