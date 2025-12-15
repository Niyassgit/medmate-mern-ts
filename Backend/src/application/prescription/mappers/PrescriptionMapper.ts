import { IPrescription } from "../../../domain/prescription/entites/IPrescription";
import { IPrescriptionItem } from "../../../domain/prescription/entites/IPrescriptionItem";
import { IPrescriptionWithItemsAndProduct } from "../../../domain/prescription/entites/IPrescriptionWIthItemsAndProduct";
import { PrescriptionDetailsDTO } from "../../Guest/interefaces/PrescriptionDetailsDTO";
import { PrescriptionDTO } from "../dto/PrescriptionDTO";
import { PrescriptionItemDTO } from "../dto/PrescriptionItemDTO";
import { PrescriptionStatus as DomainPrescriptionStatus } from "../../../shared/Enums";
import { IStorageService } from "../../../domain/common/services/IStorageService";

export class PrescriptionMapper {
  static toEntity(
    dto: PrescriptionDTO,
    doctorId: string,
    guestId: string
  ): Omit<IPrescription, "id" | "createdAt" | "updatedAt"> {
    return {
      expiresAt: dto.expiresAt,
      shareToken: dto.shareToken,
      status: dto.status || DomainPrescriptionStatus.PENDING,
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

  static async toDomain(
    data: IPrescriptionWithItemsAndProduct,
    storageService: IStorageService
  ): Promise<PrescriptionDetailsDTO> {
    const items = await Promise.all(
      data.items.map(async (item) => {
        let signedUrl: string | null = null;

        if (item.product.imageUrl?.length > 0) {
          signedUrl = await storageService.generateSignedUrl(
            item.product.imageUrl[0]
          );
        }

        return {
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          brand: item.product.brand,
          mrp: item.product.mrp,
          image: signedUrl,
          quantity: item.quantity,
          dosage: item.dosage ?? undefined,
          note: undefined,
        };
      })
    );

    return {
      id: data.id,
      notes: data.notes ?? undefined,
      status: data.status as DomainPrescriptionStatus,
      expiresAt: data.expiresAt ?? undefined,
      linkExpiresAt: data.linkExpiresAt ?? undefined,
      createdAt: data.createdAt,
      items,
      order: data.order
        ? {
          id: data.order.id,
          totalAmount: data.order.totalAmount,
          paymentStatus: data.order.paymentStatus,
          status: data.order.status,
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
