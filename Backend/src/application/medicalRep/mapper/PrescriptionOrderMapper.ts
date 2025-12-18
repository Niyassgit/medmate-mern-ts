import { RepOrderDTO } from "../dto/RepOrderDTO";
import { IOrder } from "../../../domain/order/entitiy/IOrder";
import { IStorageService } from "../../../domain/common/services/IStorageService";

export class PrescriptionOrderMapper {
  static async toDomain(
    data: IOrder,
    repId: string,
    storageService: IStorageService
  ): Promise<RepOrderDTO> {
    const repProducts =
      data.items?.filter((item) => item.repId === repId) || [];
    const totalAmount = repProducts.reduce(
      (sum, item) => sum + (item.ptr || 0) * item.quantity,
      0
    );
    const totalUnits = repProducts.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const products = await Promise.all(
      repProducts.map(async (p) => {
        let signedUrl: string | null = null;

        if (p.image) {
          signedUrl = await storageService.generateSignedUrl(p.image);
        }

        return {
          id: p.productId || "",
          name: p.name,
          image: signedUrl,
          ptr: p.ptr || 0,
          unit: p.quantity,
        };
      })
    );

    return {
      id: data.id,
      prescriptionId: data.prescriptionId,
      doctorName: data.doctorName || "Unknown",
      hospital: data.hospital || "Unknown",
      status: data.status,
      totalAmount: String(totalAmount),
      totalUnits,
      createdAt: data.createdAt,
      products,
    };
  }
}
