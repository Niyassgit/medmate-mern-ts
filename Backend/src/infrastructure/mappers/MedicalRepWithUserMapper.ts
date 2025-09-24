import { MedicalRep, User } from "@prisma/client";
import { IMedicalRepWithUser } from "../../domain/doctor/entities/IMedicalRepWithUser";
import { MedicalRepMapper } from "./MedicalRepMapper";
import { Role as DomainRole, AuthProvider as DomainAuthProvider } from "../../domain/common/entities/IUser";

export class MedicalRepWithUserMapper{

    static toDomain(rep:MedicalRep &{user:User | null}):IMedicalRepWithUser{

        return {
           ...MedicalRepMapper.toDomain(rep),
           user:rep.user ?{
             id: rep.user.id,
                        email: rep.user.email,
                        isBlocked: rep.user.isBlocked,
                        createdAt: rep.user.createdAt,
                        updatedAt: rep.user.updatedAt,
                        role: rep.user.role as DomainRole,
                        authProvider: rep.user.authProvider as DomainAuthProvider,
                        providerId: rep.user.providerId ?? null,
                        isVerified: rep.user.isVerified,
                        tokenVersion: rep.user.tokenVersion,
                        password: rep.user.password ?? null,
           }:null,
        }
    }
}