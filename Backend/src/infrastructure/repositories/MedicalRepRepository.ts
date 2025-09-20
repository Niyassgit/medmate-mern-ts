import { prisma } from "../database/PrismaClient";
import { IMedicalRepRepository } from "../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IMedicalRep } from "../../domain/medicalRep/entities/IMedicalRep";
import { IRepListItem } from "../../domain/medicalRep/entities/IRepListItem";
import { MedicalRepMapper } from "../mappers/MedicalRepMapper";
import { Prisma } from "@prisma/client";

export class MedicalRepRepository implements IMedicalRepRepository {
  async createMedicalRep(
    data: Omit<IMedicalRep, "id" | "createdAt" | "updatedAt">
  ): Promise<IMedicalRep> {
    const created = await prisma.medicalRep.create({
      data: MedicalRepMapper.toPersistance(data),
    });
    return MedicalRepMapper.toDomain(created);
  }

  async getMedicalRepById(id: string): Promise<IMedicalRep | null> {
    const found = await prisma.medicalRep.findUnique({ where: { id } });
    return found ? MedicalRepMapper.toDomain(found) : null;
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
        {login:{email:{contains:search,mode:"insensitive"}}}
      ],
    }:{};

    const [reps, total] = await Promise.all([
      prisma.medicalRep.findMany({
        where,
        include: { login: true },
        orderBy: { login: { createdAt: "desc" } },
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
