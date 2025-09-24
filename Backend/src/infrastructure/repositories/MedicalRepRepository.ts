import { prisma } from "../database/PrismaClient";
import { IMedicalRepRepository } from "../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IMedicalRep } from "../../domain/medicalRep/entities/IMedicalRep";
import { IRepListItem } from "../../domain/medicalRep/entities/IRepListItem";
import { MedicalRepMapper } from "../mappers/MedicalRepMapper";
import { Prisma } from "@prisma/client";
import { IMedicalRepWithUser } from "../../domain/doctor/entities/IMedicalRepWithUser";
import { MedicalRepWithUserMapper } from "../mappers/MedicalRepWithUserMapper";

export class MedicalRepRepository implements IMedicalRepRepository {
  async createMedicalRep(
    data: Omit<IMedicalRep, "id" | "createdAt" | "updatedAt">
  ): Promise<IMedicalRep> {
    const created = await prisma.medicalRep.create({
      data: MedicalRepMapper.toPersistance(data),
    });
    return MedicalRepMapper.toDomain(created);
  }

  async getMedicalRepById(id: string): Promise<IMedicalRepWithUser | null> {
    const user=await prisma.medicalRep.findUnique({
      where:{id},
      include:{user:true}
    });
    if(!user) return null;
    return MedicalRepWithUserMapper.toDomain(user);
  }

  async getMedicalRepByEmail(email: string): Promise<IMedicalRep | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { medicalRep: true },
    });

    if (!user || !user.medicalRep) return null;

    const rep = user.medicalRep;
    return MedicalRepMapper.toDomain(rep);
  }

  async getAllMedicalReps(
    page: number,
    limit: number,
    search:string
  ): Promise<{ reps: IRepListItem[]; total: number }> {
    const skip = (page - 1) * limit;

    const where:Prisma.MedicalRepWhereInput=search ?{
      OR:[
        {name:{contains:search,mode:"insensitive"}},
        {user:{email:{contains:search,mode:"insensitive"}}}
      ],
    }:{};

    const [reps, total] = await Promise.all([
      prisma.medicalRep.findMany({
        where,
        include: { user: true },
        orderBy: { user: { createdAt: "desc" } },
        skip,
        take: limit,
      }),
      prisma.medicalRep.count({where}),
    ]);

    return {
      reps: reps.map((r) => MedicalRepMapper.toListMedicalRep(r)),
      total,
    };
  }
}
