import {prisma} from "../database/prismaClient";
import { IMedicalRepRepository } from "../../domain/medicalRep/entities/IMedicalRepRepository";
import { MedicalRep } from "../../domain/medicalRep/entities/medicalRep";
import { RegisterMedicalRepDTO } from "../../domain/medicalRep/dto/RegisterMedicalRepDTO";

export class MedicalRepRepository implements IMedicalRepRepository{
    
   async createMedicalRep(data:RegisterMedicalRepDTO): Promise<MedicalRep> {
       return prisma.medicalRep.create({
        data:{
            ...data,
            subscriptionStatus: "inactive",
            maxConnectionsPerDay: 10
        }
       });
   }

   async getMedicalRepById(id: string): Promise<MedicalRep | null> {
       return prisma.medicalRep.findUnique({where:{id}});
   }
   async getMedicalRepByEmail(email: string): Promise<MedicalRep | null> {
       return prisma.medicalRep.findUnique({where:{email}});
   }
}