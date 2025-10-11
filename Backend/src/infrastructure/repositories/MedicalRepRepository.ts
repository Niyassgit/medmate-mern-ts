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
      },
    });
    return MedicalRepMapper.toDomain(created);
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
    search: string
  ): Promise<{ reps: IRepListItem[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.MedicalRepWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { user: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {};

    const [reps, total] = await Promise.all([
      prisma.medicalRep.findMany({
        where,
        include: { user: true },
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
      },
    });
    return MedicalRepMapper.toDomain(updatedRep);
  }
}
