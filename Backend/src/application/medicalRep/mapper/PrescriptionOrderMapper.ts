import { RepOrderDTO } from "../dto/RepOrderDTO";
import { IOrder } from "../../../domain/order/entitiy/IOrder";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { RepBusinessStatDTO } from "../dto/RepBusinessStatDTO";
import { OrderTableDTO } from "../dto/OrderTableDTO";

export class PrescriptionOrderMapper {
  static async toDomain(
    data: IOrder,
    repId: string,
    storageService: IStorageService
  ): Promise<RepOrderDTO> {
    const repProducts =
      data.items?.filter((item) => String(item.repId) === String(repId)) || [];
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

  static async toBusinessStat(
    data: IOrder[],
    repId: string,
    storageService: IStorageService
  ): Promise<RepBusinessStatDTO> {
    let totalRevenue = 0;
    let totalUnits = 0;
    let totalOrders = 0;

    const productMap = new Map<
      string,
      { name: string; image: string; revenue: number }
    >();

    for (const order of data) {
      let isOrderCounted = false;

      if (order.items) {
        for (const item of order.items) {
          if (String(item.repId) === String(repId)) {
            if (!isOrderCounted) {
              totalOrders++;
              isOrderCounted = true;
            }

            const revenue = (item.ptr || 0) * item.quantity;
            totalRevenue += revenue;
            totalUnits += item.quantity;

            const productId = String(item.productId);
            if (!productMap.has(productId)) {
              productMap.set(productId, {
                name: item.name,
                image: item.image || "",
                revenue: 0,
              });
            }

            const productStat = productMap.get(productId)!;
            productStat.revenue += revenue;
          }
        }
      }
    }

    const topProducts = Array.from(productMap.entries())
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5);

    const TopProducts = await Promise.all(
      topProducts.map(async ([id, stat]) => {
        let signedUrl = "";
        if (stat.image) {
          signedUrl = await storageService.generateSignedUrl(stat.image);
        }
        return {
          id,
          name: stat.name,
          imageUrl: signedUrl,
        };
      })
    );


 
    const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const limitedData = sortedData.slice(0, 20);
    const ordersList = this.toListOrderTable(limitedData);

    return {
      totalRevenue,
      totalUnits,
      totalOrders,
      monthlyRevenue: totalRevenue,
      TopProducts,
      ordersList,
    };
  }

  static toListOrderTable(data: IOrder[]): OrderTableDTO[] {
    const result: OrderTableDTO[] = [];

    data.forEach((order) => {
      if (order.items && order.items.length > 0) {
        order.items.forEach((item) => {
          result.push({
            id: order.id,
            name: item.name,
            units: item.quantity.toString(),
            ptr: item.ptr || 0,
            orderStatus: order.status,
          });
        });
      }
    });

    return result;
  }
}
