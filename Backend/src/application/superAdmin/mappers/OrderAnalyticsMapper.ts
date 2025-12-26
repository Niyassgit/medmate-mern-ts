import { IOrder } from "../../../domain/order/entitiy/IOrder";
import { OrderAnalyticsDTO } from "../dto/OrderAnalyticsDTO";
import { UpdateOrderStatusResponseDTO } from "../dto/UpdateOrderStatusResponseDTO";
import { RevenueTimelineEntry } from "../utils/RevenuePeriodUtil";

export class OrderAnalyticsMapper {
  static todomain(
    totalPrescriptions: number,
    paidOrders: number,
    grossAmount: number,
    doctorEarnings: number,
    unpaidPrescriptions: number,
    adminEarnings: number,
    revenueTimeline: RevenueTimelineEntry[]
  ): OrderAnalyticsDTO {
    return {
      summary: {
        totalPrescriptions,
        paidOrders,
        grossAmount,
        doctorEarnings,
        adminEarnings,
      },
      charts: {
        revenueOverTime: revenueTimeline.map((entry) => ({
          date: entry.period,
          amount: Number(entry.amount.toFixed(2)),
        })),
        paidVsUnpaid: {
          paid: paidOrders,
          unpaid: unpaidPrescriptions,
        },
        earningsSplit: {
          doctor: doctorEarnings,
          admin: adminEarnings,
        },
      },
    };
  }

  static toOrderUpdate(data: IOrder): UpdateOrderStatusResponseDTO {
    return {
      id: data.id,
      orderId: data.id,
      status: data.status,
      paymentStatus: data.paymentStatus,
      updatedAt: data.updatedAt,
    };
  }
}
