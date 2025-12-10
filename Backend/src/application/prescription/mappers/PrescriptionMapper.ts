import { IPrescription } from "../../../domain/prescription/entites/IPrescription";
import { IPrescriptionItem } from "../../../domain/prescription/entites/IPrescriptionItem";
import { PrescriptionDTO } from "../dto/PrescriptionDTO";
import { PrescriptionItemDTO } from "../dto/PrescriptionItemDTO";
import { PrescriptionStatus } from "@prisma/client";

export class PrescriptionMapper {
  static toEntity(
    dto: PrescriptionDTO,
    doctorId: string,
    guestId: string
  ): Omit<IPrescription, "id" | "createdAt" | "updatedAt"> {
    return {
      expiresAt: dto.expiresAt,
      shareToken: dto.shareToken,
      status: dto.status || PrescriptionStatus.PENDING,
      linkExpiresAt: dto.linkExpiresAt,
      notes: dto.notes,
      guestId,
      doctorId,
    };
  }

  static toPrescriptionItemEntity(
    dto: PrescriptionItemDTO,
    prescriptionId: string
  ): Omit<IPrescriptionItem, "id"> {
    return {
      prescriptionId,
      productId: dto.productId,
      productPostId: null,
      dosage: dto.dosage ?? null,
      quantity: dto.quantity ?? 1,
    };
  }
}
