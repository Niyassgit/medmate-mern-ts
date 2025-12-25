import { OrderAnalyticsDTO } from "../dto/OrderAnalyticsDTO";
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
}
