import { prisma } from "../database/prisma";
import { Prisma, Doctor } from "@prisma/client";
import { IDoctorRepository } from "../../domain/doctor/repositories/IDoctorRepository";
import { IDoctor } from "../../domain/doctor/entities/IDoctor";
import { IDoctorListItem } from "../../domain/doctor/entities/IDoctorListItem";
import { DoctorMapper } from "../mappers/DoctorMapper";
import { IDoctorWithUser } from "../../domain/doctor/entities/IDoctorWithUser";
import { DoctorWithUserMapper } from "../mappers/DoctorWithUserMapper";
import { BaseRepository } from "../database/BaseRepository";

export class DoctorRepository
  extends BaseRepository<IDoctor, Doctor, Prisma.DoctorCreateInput, "doctor">
  implements IDoctorRepository
{
  async createDoctor(
    data: Omit<IDoctor, "id" | "updatedAt" | "createdAt">
  ): Promise<IDoctor> {
    const mappedData = DoctorMapper.toPersistance(data);
    return await this.create(mappedData);
  }
  constructor() {
    super(prisma.doctor, (doctor) => DoctorMapper.toDomain(doctor));
  }

  async getDoctorById(id: string): Promise<IDoctorWithUser | null> {
    const doctor = await prisma.doctor.findFirst({
      where: { id },
      include: {
        user: true,
        educations: true,
        certificates: true,
      },
    });
    if (!doctor) return null;
    return DoctorWithUserMapper.toDomain(doctor);
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

  async existById(id: string): Promise<boolean> {
    const user = await prisma.doctor.findFirst({
      where: { id },
      select: { id: true },
    });
    return !!user;
  }
  async getDoctorIdByUserId(
    userId: string
  ): Promise<{ doctorId: string | null }> {
    const doctor = await prisma.doctor.findFirst({
      where: { loginId: userId },
      select: { id: true },
    });
    return { doctorId: doctor ? doctor.id : null };
  }
  async getDoctorByUserId(id: string): Promise<IDoctorWithUser | null> {
    const user = await prisma.doctor.findFirst({
      where: { loginId: id },
      include: {
        user: true,
        educations: true,
        certificates: true,
        territory: true,
        department: true,
      },
    });

    if (!user) return null;
    return DoctorWithUserMapper.toDomain(user);
  }
  async updateDoctor(
    userId: string,
    data: Partial<IDoctor>
  ): Promise<IDoctor | null> {
    const doctor = await this.findById(userId);

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
  async findByTerritoryAndDepartment(
    departmentId: string,
    territories: string[]
  ): Promise<IDoctorWithUser[]> {
    const doctors = await prisma.doctor.findMany({
      where: {
        departmentId,
        territoryId: { in: territories },
      },
      include: {
        user: true,
        department: true,
        territory: true,
        educations: true,
      },
    });
    return doctors.map((doc) => DoctorWithUserMapper.toDomain(doc));
  }
  async getUserIdByDoctorId(
    doctorId: string
  ): Promise<{ doctorUserId: string | null }> {
    const user = await prisma.doctor.findFirst({
      where: { id: doctorId },
      select: { loginId: true },
    });
    return {
      doctorUserId: user ? user.loginId : null,
    };
  }
}
