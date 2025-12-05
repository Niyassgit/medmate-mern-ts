import { prisma } from "../database/prisma";
import { IMedicalRepRepository } from "../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IMedicalRep } from "../../domain/medicalRep/entities/IMedicalRep";
import { IRepListItem } from "../../domain/medicalRep/entities/IRepListItem";
import { MedicalRepMapper } from "../mappers/MedicalRepMapper";
import { MedicalRep, Prisma } from "@prisma/client";
import { IMedicalRepWithUser } from "../../domain/medicalRep/entities/IMedicalRepWithUser";
import { MedicalRepWithUserMapper } from "../mappers/MedicalRepWithUserMapper";
import { BaseRepository } from "../database/BaseRepository";

export class MedicalRepRepository
  extends BaseRepository<
    IMedicalRep,
    MedicalRep,
    Prisma.MedicalRepCreateInput,
    "medicalRep"
  >
  implements IMedicalRepRepository
{
  constructor() {
    super(prisma.medicalRep, (rep) => MedicalRepMapper.toDomain(rep));
  }

  async createMedicalRep(
    data: Omit<IMedicalRep, "id" | "createdAt" | "updatedAt">
  ): Promise<IMedicalRep> {
    const created = await prisma.medicalRep.create({
      data: MedicalRepMapper.toPersistance(data),
      include: {
        educations: true,
        certificates: true,
        territories: {
          include: { territory: true },
        },
      },
    });
    return MedicalRepMapper.toDomain(created);
  }

  async existById(id: string): Promise<boolean> {
    const rep = await prisma.medicalRep.findFirst({
      where: { id },
      select: { id: true },
    });
    return !!rep;
  }

  async getRepIdByUserId(userId: string): Promise<{ repId: string | null }> {
    const rep = await prisma.medicalRep.findFirst({
      where: { loginId: userId },
      select: { id: true },
    });
    return { repId: rep ? rep.id : null };
  }
  async getMedicalRepById(id: string): Promise<IMedicalRepWithUser | null> {
    const user = await prisma.medicalRep.findUnique({
      where: { id },
      include: {
        user: true,
        educations: true,
        certificates: true,
      },
    });
    if (!user) return null;
    return MedicalRepWithUserMapper.toDomain(user);
  }

  async getMedicalRepByEmail(email: string): Promise<IMedicalRep | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        medicalRep: {
          include: {
            educations: true,
            certificates: true,
          },
        },
      },
    });

    if (!user || !user.medicalRep) return null;

    const rep = user.medicalRep;
    return MedicalRepMapper.toDomain(rep);
  }

  async getAllMedicalReps(
    page: number,
    limit: number,
    search: string,
    territory?: string
  ): Promise<{ reps: IRepListItem[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.MedicalRepWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (territory) {
      where.territories = {
        some: {
          territoryId: territory,
        },
      };
    }

    const [reps, total] = await Promise.all([
      prisma.medicalRep.findMany({
        where,
        include: {
          user: true,
          territories: {
            include: {
              territory: true,
            },
          },
        },
        orderBy: { user: { createdAt: "desc" } },
        skip,
        take: limit,
      }),
      prisma.medicalRep.count({ where }),
    ]);

    return {
      reps: reps.map((r) => MedicalRepMapper.toListMedicalRep(r)),
      total,
    };
  }
  async findMedicalRepIdByUserId(userId: string): Promise<string | null> {
    const rep = await prisma.medicalRep.findUnique({
      where: { loginId: userId },
      select: { id: true },
    });
    return rep ? rep.id : null;
  }
  async getMedicalRepByUserId(id: string): Promise<IMedicalRepWithUser | null> {
    const user = await prisma.medicalRep.findFirst({
      where: { loginId: id },
      include: {
        user: true,
        educations: true,
        certificates: true,
        territories: { include: { territory: true } },
        department: true,
      },
    });
    if (!user) return null;
    return MedicalRepWithUserMapper.toDomain(user);
  }
  async completeProfile(
    userId: string,
    data: Partial<IMedicalRep>
  ): Promise<IMedicalRep | null> {
    const updateData = MedicalRepMapper.toPartialPersistence(data);

    const updatedRep = await prisma.medicalRep.update({
      where: { id: userId },
      data: updateData,
      include: {
        user: true,
        educations: true,
        certificates: true,
        territories: { include: { territory: true } },
      },
    });
    return MedicalRepMapper.toDomain(updatedRep);
  }
  async findByTerritoryAndDepartment(
    territoryId: string,
    departmentId: string
  ): Promise<IMedicalRepWithUser[]> {
    const reps = await prisma.medicalRep.findMany({
      where: {
        departmentId: departmentId,
        territories: {
          some: {
            territoryId: territoryId,
          },
        },
      },
      include: {
        user: true,
        territories: {
          include: { territory: true },
        },
        department: true,
      },
    });
    return reps.map((rep) => MedicalRepWithUserMapper.toDomain(rep));
  }

  async getUserIdByRepId(repId: string): Promise<{ repUserId: string | null }> {
    const user = await prisma.medicalRep.findFirst({
      where: { id: repId },
      select: { loginId: true },
    });
    return { repUserId: user ? user.loginId : null };
  }

  async countReps(startDate?: Date, endDate?: Date): Promise<number> {
    const whereClause: Prisma.MedicalRepWhereInput = {};

    if (startDate || endDate) {
      const createdAtFilter: Prisma.DateTimeFilter = {};
      if (startDate) {
        createdAtFilter.gte = startDate;
      }
      if (endDate) {
        createdAtFilter.lte = endDate;
      }
      whereClause.user = {
        createdAt: createdAtFilter,
      };
    }

    const count = await prisma.medicalRep.count({
      where: whereClause,
    });

    return count;
  }

  async getMonthlyRepGrowth(
    year: number
  ): Promise<{ month: number; count: number }[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const reps = await prisma.medicalRep.findMany({
      where: {
        user: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      include: {
        user: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    const monthlyCount: { [key: number]: number } = {};

    reps.forEach((rep) => {
      const month = rep.user!.createdAt.getMonth();
      monthlyCount[month] = (monthlyCount[month] || 0) + 1;
    });

    const result: { month: number; count: number }[] = [];
    for (let month = 0; month < 12; month++) {
      result.push({
        month,
        count: monthlyCount[month] || 0,
      });
    }

    return result;
  }

  async findByIds(repIds: string[]): Promise<IMedicalRep[]> {
    const reps=await prisma.medicalRep.findMany({
      where:{
        id:{in:repIds}
      },
      include:{
        subscriptionPlan:true,
        department:true,
        territories:{
          include:{
            territory:true
          }
        }
      }
    });
    return reps.map(rep=>MedicalRepMapper.toDomain(rep));
  }
}
