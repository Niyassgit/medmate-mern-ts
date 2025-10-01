import { prisma } from "../database/prisma";
import { Prisma } from "@prisma/client";
import { IDoctorRepository } from "../../domain/doctor/repositories/IDoctorRepository";
import { IDoctor } from "../../domain/doctor/entities/IDoctor";
import { IDoctorListItem } from "../../domain/doctor/entities/IDoctorListItem";
import { DoctorMapper } from "../mappers/DoctorMapper";
import { IDoctorWithUser } from "../../domain/doctor/entities/IDoctorWithUser";
import { DoctorWithUserMapper } from "../mappers/DoctorWithUserMapper";

export class DoctorRepository implements IDoctorRepository {
  async createDoctor(
    data: Omit<IDoctor, "id" | "updatedAt" | "createdAt">
  ): Promise<IDoctor> {
    const created = await prisma.doctor.create({
      data: DoctorMapper.toPersistance(data),
    });
    return DoctorMapper.toDomain(created);
  }

  async getDoctorById(id: string): Promise<IDoctorWithUser | null> {
    const user = await prisma.doctor.findUnique({
      where: { id },
      include: {
         user: true,
         educations:true,
         certificates:true
        },
    });
    if (!user) return null;
    return DoctorWithUserMapper.toDomain(user);
  }

  async getDoctorByEmail(email: string): Promise<IDoctor | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { doctor: true },
    });

    if (!user || !user.doctor) return null;
    const doc = user.doctor;

    return DoctorMapper.toDomain(doc);
  }
  async getAllDoctors(
    page: number,
    limit: number,
    search: string
  ): Promise<{ doctors: IDoctorListItem[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.DoctorWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { user: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {};
    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        include: { user: true },
        orderBy: { user: { createdAt: "desc" } },
        skip,
        take: limit,
      }),
      prisma.doctor.count({ where }),
    ]);

    return {
      doctors: doctors.map((d) => DoctorMapper.toListItem(d)),
      total,
    };
  }

  async getDoctorByUserId(id: string): Promise<IDoctorWithUser | null> {
    const user=await prisma.doctor.findFirst({
      where:{loginId:id},
      include:{
        user:true,
        educations:true,
        certificates:true
      }
    });

    if(!user) return null;
    return DoctorWithUserMapper.toDomain(user);
  }
  async updateProfileImage(userId: string, imageUrl: string): Promise<void> {
        await prisma.doctor.update({
          where:{id:userId},
          data:{profileImage:imageUrl},
        });
  }
 async updateDoctor(userId: string, data: Partial<IDoctor>): Promise<IDoctor | null> {
  const doctor = await prisma.doctor.findFirst({
    where: { id: userId },
  });

  if (!doctor) return null;

  const updateDoctor = await prisma.doctor.update({
    where: { id: doctor.id },
    data: DoctorMapper.toPartialPersistence(data),
    include: {
      user: true,
      educations: true,
      certificates: true,
    },
  });
  
  return DoctorWithUserMapper.toDomain(updateDoctor);
}

}
