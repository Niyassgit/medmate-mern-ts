import {
  Prisma,
  Prescription,
  PrescriptionItem,
  Product,
  Order,
} from "@prisma/client";
import { IPrescription } from "../../domain/prescription/entites/IPrescription";
import { IPrescriptionWithItemsAndProduct } from "../../domain/prescription/entites/IPrescriptionWIthItemsAndProduct";
import { OrderStatus, PaymentStatus } from "../../shared/Enums";

export class PrescriptionMapper {
  static toDomain(data: Prescription): IPrescription {
    return {
      id: data.id,
      doctorId: data.doctorId,
      guestId: data.guestId,
      notes: data.notes ?? undefined,
      status: data.status,
      expiresAt: data.expiresAt ?? undefined,
      shareToken: data.shareToken ?? undefined,
      linkExpiresAt: data.linkExpiresAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static toPersistance(
    data: Omit<IPrescription, "id" | "createdAt" | "updatedAt">
  ): Prisma.PrescriptionCreateInput {
    return {
      doctor: { connect: { id: data.doctorId } },
      guest: { connect: { id: data.guestId } },
      notes: data.notes ?? null,
      status: data.status,
      expiresAt: data.expiresAt ?? null,
      shareToken: data.shareToken ?? null,
      linkExpiresAt: data.linkExpiresAt ?? null,
    };
  }

  static toUpdatePersistance(
    data: Partial<Omit<IPrescription, "id" | "createdAt" | "updatedAt">>
  ): Prisma.PrescriptionUpdateInput {
    const updateData: Prisma.PrescriptionUpdateInput = {};

    if (data.doctorId !== undefined) {
      updateData.doctor = { connect: { id: data.doctorId } };
    }
    if (data.guestId !== undefined) {
      updateData.guest = { connect: { id: data.guestId } };
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes ?? null;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.expiresAt !== undefined) {
      updateData.expiresAt = data.expiresAt ?? null;
    }
    if (data.shareToken !== undefined) {
      updateData.shareToken = data.shareToken ?? null;
    }
    if (data.linkExpiresAt !== undefined) {
      updateData.linkExpiresAt = data.linkExpiresAt ?? null;
    }

    return updateData;
  }

  static toDomainWithItems(
    data: Prescription & {
      items: (PrescriptionItem & { product: Product })[];
      order?: Order | null;
      doctor: {
        name: string;
        hospital: string;
      };
      guest: { name: string; email: string | null; phone: string | null };
    }
  ): IPrescriptionWithItemsAndProduct {
    return {
      id: data.id,
      doctorId: data.doctorId,
      guestId: data.guestId,
      notes: data.notes ?? undefined,
      status: data.status,
      expiresAt: data.expiresAt ?? undefined,
      shareToken: data.shareToken ?? undefined,
      linkExpiresAt: data.linkExpiresAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,

      items: data.items.map((item) => ({
        id: item.id,
        prescriptionId: item.prescriptionId,
        productId: item.productId,
        dosage: item.dosage ?? undefined,
        quantity: item.quantity,

        product: {
          id: item.product.id,
          repId: item.product.repId,
          name: item.product.name,
          brand: item.product.brand,
          imageUrl: item.product.imageUrl,
          ingredients: item.product.ingredients,
          mrp: item.product.mrp,
          ptr: item.product.ptr,
          territoryIds: item.product.territoryIds,
          createdAt: item.product.createdAt,
          updatedAt: item.product.updatedAt,
        },
      })),

      order: data.order
        ? {
            id: data.order.id,
            paymentStatus: data.order.paymentStatus as PaymentStatus,
            status: data.order.status as OrderStatus,
            totalAmount: data.order.totalAmount,
          }
        : null,
      doctor: {
        name: data.doctor.name,
        hospital: data.doctor.hospital,
      },
      guest: {
        name: data.guest.name,
        email: data.guest.email,
        phone: data.guest.phone,
      },
    };
  }
}
