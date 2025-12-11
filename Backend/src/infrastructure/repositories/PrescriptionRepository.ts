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
  implements IPrescriptionRepository
{
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
    DoctorId: string
  ): Promise<IPrescription[]> {
    const prescriptions = await prisma.prescription.findMany({
      where: { doctorId: DoctorId },
      orderBy: { createdAt: "desc" },
    });
    return prescriptions.map((p) => PrescriptionMapper.toDomain(p));
  }

  async findAllPrescriptionsByGuestId(guestId: string): Promise<IPrescriptionWithItemsAndProduct[]> {
    const prescriptions = await prisma.prescription.findMany({
      where: { guestId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true, 
          },
        },
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
}
