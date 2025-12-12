import { Prisma, PrescriptionItem } from "@prisma/client";
import { IPrescriptionItem } from "../../domain/prescription/entites/IPrescriptionItem";

export class PrescriptionItemMapper {
  static toDomain(data: PrescriptionItem): IPrescriptionItem {
    return {
      id: data.id,
      prescriptionId: data.prescriptionId,
      productId: data.productId,
      productPostId: data.productPostId ?? null,
      dosage: data.dosage ?? null,
      quantity: data.quantity,
    };
  }

  static toPersistance(
    data: Omit<IPrescriptionItem, "id">
  ): Prisma.PrescriptionItemCreateInput {
    return {
      prescription: { connect: { id: data.prescriptionId } },
      product: { connect: { id: data.productId } },
      ...(data.productPostId
        ? { productPost: { connect: { id: data.productPostId } } }
        : {}),
      dosage: data.dosage ?? null,
      quantity: data.quantity,
    };
  }
}

