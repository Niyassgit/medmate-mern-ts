import { Prisma, Prescription } from "@prisma/client";
import { IPrescription } from "../../domain/prescription/entites/IPrescription";

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
}