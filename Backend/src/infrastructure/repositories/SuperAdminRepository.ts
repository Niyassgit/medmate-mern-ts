import { ISuperAdminRepository } from "../../domain/superAdmin/entities/ISuperAdminRepository";
import { SuperAdmin } from "../../domain/superAdmin/entities/superAdmin";
import {prisma} from "../database/prismaClient";



export class SuperAdminRepository implements ISuperAdminRepository{
 
    async createSuperAdmin(data: Omit<SuperAdmin, "id" | "createdAt" | "updatedAt">): Promise<SuperAdmin> {
        const created=await prisma.superAdmin.create({
            data:{
                ...data,
            }
        });
        return created;
    }

    async getSuperAdminByEmail(email: string): Promise<SuperAdmin | null> {
        const userLogin=await prisma.userLogin.findUnique({
            where:{email},
            include:{superAdmin:true}
        });

        if(!userLogin || !userLogin.superAdmin) return null;

        const admin=userLogin.superAdmin;

        return{

            id:admin.id,
            loginId:admin.loginId,
            name:admin.name,
            phone:admin.phone
        }
    }


}