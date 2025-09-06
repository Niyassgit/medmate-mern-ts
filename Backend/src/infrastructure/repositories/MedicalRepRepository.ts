import {prisma} from "../database/PrismaClient";
import { IMedicalRepRepository } from "../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IMedicalRep } from "../../domain/medicalRep/entities/IMedicalRep";
import { IRepListItem } from "../../domain/medicalRep/entities/IRepListItem";



export class MedicalRepRepository implements IMedicalRepRepository{

     async createMedicalRep(data: Omit<IMedicalRep, "id" | "createdAt" | "updatedAt">): Promise<IMedicalRep> {
         const created= await prisma.medicalRep.create({
            data:{
                ...data,
            }
         });
         return created;
     }

     async getMedicalRepById(id: string): Promise<IMedicalRep | null> {
         return prisma.medicalRep.findUnique({where:{id}});
     }

     async getMedicalRepByEmail(email: string): Promise<IMedicalRep | null> {
        
       const userLogin=await prisma.userLogin.findUnique({
        where:{email},
        include:{medicalRep:true},
       });

       if(!userLogin || !userLogin.medicalRep) return null;

       const rep=userLogin.medicalRep;
       
       return {
           id: rep.id,
        name: rep.name,
        phone: rep.phone,
        companyName: rep.companyName,
        companyLogoUrl: rep.companyLogoUrl ?? null,
        employeeId: rep.employeeId ?? null,
        departmentId: rep.departmentId ?? null,
        about: rep.about ?? null,
        subscriptionPlanId: rep.subscriptionPlanId ?? null,
        subscriptionStatus: rep.subscriptionStatus ?? null,
        subscriptionStart: rep.subscriptionStart ?? null,
        subscriptionEnd: rep.subscriptionEnd ?? null,
        maxConnectionsPerDay: rep.maxConnectionsPerDay ?? 0,
        loginId: rep.loginId,
        createdAt: rep.createdAt,
        updatedAt: rep.updatedAt,
       }

      
     }

     async getAllMedicalReps(): Promise<IRepListItem[]> {
         
        const reps=await prisma.medicalRep.findMany({
            include:{login:true},
            orderBy:{
                login:{
                    createdAt:"desc"
                }
            }
        });

        return reps.map(r=>({
            id:r.id,
            name:r.name,
            email:r.login?.email ?? null,
            phone:r.phone,
            employeeId:r.employeeId,
            isBlocked:r.login?.isBlocked ?? null,
            subscriptionStatus:r.subscriptionStatus ?? null,
            createdAt:r.login?.createdAt ?? null,
            loginId:r.loginId ?? null,

        }))
     }
  
}