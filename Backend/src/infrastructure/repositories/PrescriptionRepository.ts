import { Prescription, Prisma } from "@prisma/client";
import { IPrescription } from "../../domain/prescription/entites/IPrescription";
import { IPrescriptionRepository } from "../../domain/prescription/repositories/IPrescriptionRepository";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../database/prisma";
import { PrescriptionMapper } from "../mappers/PrescriptionMapper";
import { NotFoundError } from "../../application/errors";
import { ErrorMessages } from "../../shared/Messages";
import { IPrescriptionWithItemsAndProduct } from "../../domain/prescription/entites/IPrescriptionWIthItemsAndProduct";

export class PrescriptionRepository
  extends BaseRepository<
    IPrescription,
    Prescription,
    Prisma.PrescriptionCreateInput,
    "prescription"
  >
  implements IPrescriptionRepository {
  constructor() {
    super(prisma.prescription, (p) => PrescriptionMapper.toDomain(p));
  }

  async createPrescription(
    data: Omit<IPrescription, "id" | "createdAt" | "updatedAt">
  ): Promise<IPrescription> {
    const mappedData = PrescriptionMapper.toPersistance(data);
    return await this.create(mappedData);
  }

  async findAllPrescriptionByDoctorId(
    doctorId: string,
    page: number,
    limit: number
  ): Promise<{
    prescriptions: IPrescriptionWithItemsAndProduct[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where: { doctorId },
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { product: true } },
          order: true,
          doctor: true,
          guest: true,
        },
        skip,
        take: limit,
      }),
      prisma.prescription.count({ where: { doctorId } }),
    ]);

    return {
      prescriptions: prescriptions.map((p) =>
        PrescriptionMapper.toDomainWithItems(p)
      ),
      total,
    };
  }


  async findAllPrescriptionsByGuestId(
    guestId: string
  ): Promise<IPrescriptionWithItemsAndProduct[]> {
    const prescriptions = await prisma.prescription.findMany({
      where: { guestId },
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: true } },
        order: true,
        doctor: true,
        guest: true,
      },
    });

    return prescriptions.map((p) => PrescriptionMapper.toDomainWithItems(p));
  }

  async findPrescriptionById(prescriptionId: string): Promise<IPrescription> {
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
    });
    if (!prescription) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }
    return PrescriptionMapper.toDomain(prescription);
  }

  async updatePrescription(
    prescriptionId: string,
    data: Partial<Omit<IPrescription, "id" | "createdAt" | "updatedAt">>
  ): Promise<IPrescription> {
    const mappedData = PrescriptionMapper.toUpdatePersistance(data);
    const updated = await prisma.prescription.update({
      where: { id: prescriptionId },
      data: mappedData,
    });
    return PrescriptionMapper.toDomain(updated);
  }

  async findPrescriptionByShareToken(
    shareToken: string
  ): Promise<IPrescription | null> {
    const prescription = await prisma.prescription.findUnique({
      where: { shareToken },
    });
    if (!prescription) return null;
    if (prescription.linkExpiresAt && prescription.linkExpiresAt < new Date()) {
      return null;
    }
    return PrescriptionMapper.toDomain(prescription);
  }

  async findPrescriptionByIdWithItems(
    id: string
  ): Promise<IPrescriptionWithItemsAndProduct | null> {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        order: true,
        doctor: true,
        guest: true,
      },
    });

    if (!prescription) return null;
    return PrescriptionMapper.toDomainWithItems(prescription);
  }
  async findCountOfAllPrescriptions(start?: Date, end?: Date): Promise<number> {
    const whereClause: Prisma.PrescriptionWhereInput = {};

    if (start || end) {
      whereClause.createdAt = {};
      if (start) whereClause.createdAt.gte = start;
      if (end) whereClause.createdAt.lte = end;
    }

    return prisma.prescription.count({
      where: whereClause,
    });
  }

  async countPrescriptionsByDoctor(
    doctorId: string,
    start?: Date,
    end?: Date
  ): Promise<number> {
    const whereClause: Prisma.PrescriptionWhereInput = {
      doctorId,
    };

    if (start || end) {
      whereClause.createdAt = {};
      if (start) {
        whereClause.createdAt.gte = start;
      }
      if (end) {
        whereClause.createdAt.lte = end;
      }
    }

    return await prisma.prescription.count({
      where: whereClause,
    });
  }
}
