import { prisma } from "../database/PrismaClient";
import { IDoctorRepository } from "../../domain/doctor/repositories/IDoctorRepository";
import { IDoctor } from "../../domain/doctor/entities/IDoctor";
import { IDoctorListItem } from "../../domain/doctor/entities/IDoctorListItem";
import { DoctorMapper } from "../mappers/DoctorMapper";

export class DoctorRepository implements IDoctorRepository {
  async createDoctor(
    data: Omit<IDoctor, "id" | "updatedAt" | "createdAt">
  ): Promise<IDoctor> {
    const created = await prisma.doctor.create({
      data: DoctorMapper.toPersistance(data),
    });
    return DoctorMapper.toDomain(created);
  }

  async getDoctorById(id: string): Promise<IDoctor | null> {
    const found = await prisma.doctor.findUnique({ where: { id } });
    return found ? DoctorMapper.toDomain(found) : null;
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
    limit: number
  ): Promise<{ doctors: IDoctorListItem[]; total: number }> {
    const skip = (page - 1) * limit;
    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        include: { login: true },
        orderBy: { login: { createdAt: "desc" } },
        skip,
        take: limit,
      }),
      prisma.doctor.count(),
    ]);

    return {
      doctors: doctors.map((d) => DoctorMapper.toListItem(d)),
      total,
    };
  }
}
