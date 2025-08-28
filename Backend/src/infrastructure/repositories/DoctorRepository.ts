import {prisma} from "../database/PrismaClient";
import { IDoctorRepository } from "../../domain/doctor/entities/IDoctorRepository";
import { IDoctor } from "../../domain/doctor/entities/IDoctor";


export class DoctorRepository implements IDoctorRepository{

    async createDoctor(data: Omit<IDoctor, "id" | "updatedAt" | "createdAt">): Promise<IDoctor> {
        return prisma.doctor.create({
            data:{
                ...data,
            }
        })
    }

     async getDoctorById(id: string): Promise<IDoctor | null> {
        return prisma.doctor.findUnique({where:{id}});
    }
    
    async getDoctorByEmail(email: string): Promise<IDoctor | null> {

         const userLogin=await  prisma.userLogin.findUnique({
             where:{email},
             include:{doctor:true}
         });

         if(!userLogin || !userLogin.doctor) return null;
         const doc=userLogin.doctor;
 
        return {
            id:doc.id,
            name:doc.name,
            phone:doc.phone,
            departmentId:doc.departmentId ?? null,
            experienceYears:doc.experienceYears ?? null,
            hasOwnClinic:doc.hasOwnClinic ?? null,
            doctorClass:doc.doctorClass ?? null,
            territoryId:doc.doctorClass ?? null,
            loginId:doc.loginId ?? null,
            registrationId:doc.registrationId,
            hospitalId:doc.registrationId,
            licenseImageUrl:doc.licenseImageUrl,
            opHours:doc.opHours ?? null,
            about:doc.about ?? null,
            educations:doc.educations ?? [],
            certificates:doc.certificates ?? [],
            createdAt:doc.createdAt,
            updatedAt:doc.updatedAt,
        }


    }
}