import {prisma} from "../database/prismaClient";
import { IMedicalRepRepository } from "../../domain/medicalRep/entities/IMedicalRepRepository";
import { MedicalRep } from "../../domain/medicalRep/entities/medicalRep";


export class MedicalRepRepository implements IMedicalRepRepository{

     async createMedicalRep(data: Omit<MedicalRep, "id" | "createdAt" | "updatedAt">): Promise<MedicalRep> {
         const created= await prisma.medicalRep.create({
            data:{
                ...data,
            }
         });
         return created;
     }

     async getMedicalRepById(id: string): Promise<MedicalRep | null> {
         return prisma.medicalRep.findUnique({where:{id}});
     }

     async getMedicalRepByEmail(email: string): Promise<MedicalRep | null> {
        
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
  
}