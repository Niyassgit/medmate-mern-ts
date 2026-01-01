import { IOrder } from "../../../domain/order/entitiy/IOrder";
import { AdvancedBusinessAnalyticsDTO } from "../dto/AdvancedBusinessAnalyticsDTO";
import { RepBusinessStatDTO } from "../dto/RepBusinessStatDTO";
import { Period } from "../../../shared/Enums";
import { RevenuePeriodUtil } from "../../superAdmin/utils/RevenuePeriodUtil";

export class AdvancedBusinessAnalyticsMapper {
  static toAdvancedAnalytics(
    basicStats: RepBusinessStatDTO,
    orders: IOrder[],
    previousOrders: IOrder[],
    repId: string,
    commissionPeriod: "weekly" | "monthly" | "yearly" | "custom",
    startDate: Date,
    endDate: Date
  ): AdvancedBusinessAnalyticsDTO {
    const previousPeriodRevenue = this._calculatePreviousPeriodRevenue(
      previousOrders,
      repId
    );

    const currentPeriodRevenue = basicStats.totalRevenue;

    const growthMetrics = this._calculateGrowthMetrics(
      previousPeriodRevenue,
      currentPeriodRevenue,
      commissionPeriod
    );

    const revenueTimelineData = this._calculateRevenueTimelineData(
      orders,
      repId
    );

    const revenueTimeline = RevenuePeriodUtil.groupRevenueByPeriod(
      revenueTimelineData,
      commissionPeriod,
      startDate,
      endDate
    );

    const revenueByDoctor = this._calculateRevenueByDoctor(orders, repId);
    const revenueByTerritory = this._calculateRevenueByTerritory(orders, repId);
    const revenueByStatus = this._calculateRevenueByStatus(orders, repId);
    const productPerformance = this._calculateProductPerformance(orders, repId);

    return {
      ...basicStats,
      revenueTimeline,
      growthMetrics,
      revenueByDoctor,
      revenueByTerritory,
      revenueByStatus,
      productPerformance,
    };
  }

  private static _calculatePreviousPeriodRevenue(
    orders: IOrder[],
    repId: string
  ): number {
    let previousPeriodRevenue = 0;
    orders.forEach((order) => {
      if (order.items) {
        order.items.forEach((item) => {
          if (String(item.repId) === String(repId)) {
            previousPeriodRevenue += (item.ptr || 0) * item.quantity;
          }
        });
      }
    });
    return previousPeriodRevenue;
  }

  private static _calculateGrowthMetrics(
    previousPeriodRevenue: number,
    currentPeriodRevenue: number,
    commissionPeriod: "weekly" | "monthly" | "yearly" | "custom"
  ): {
    previousPeriodRevenue: number;
    currentPeriodRevenue: number;
    growthPercentage: number;
    growthAmount: number;
    period: Period;
  } {
    const growthAmount = currentPeriodRevenue - previousPeriodRevenue;
    const growthPercentage =
      previousPeriodRevenue > 0
        ? (growthAmount / previousPeriodRevenue) * 100
        : currentPeriodRevenue > 0
        ? 100
        : 0;

    const periodType = this._mapCommissionPeriodToPeriod(commissionPeriod);

    return {
      previousPeriodRevenue,
      currentPeriodRevenue,
      growthPercentage: Number(growthPercentage.toFixed(2)),
      growthAmount,
      period: periodType,
    };
  }

  private static _calculateRevenueTimelineData(
    orders: IOrder[],
    repId: string
  ): { createdAt: Date; totalAmount: number }[] {
    const revenueData: { createdAt: Date; totalAmount: number }[] = [];

    orders.forEach((order) => {
      if (order.items) {
        let orderRevenue = 0;
        order.items.forEach((item) => {
          if (String(item.repId) === String(repId)) {
            orderRevenue += (item.ptr || 0) * item.quantity;
          }
        });

        if (orderRevenue > 0) {
          revenueData.push({
            createdAt: order.createdAt,
            totalAmount: orderRevenue,
          });
        }
      }
    });

    return revenueData;
  }

  private static _calculateRevenueByDoctor(
    orders: IOrder[],
    repId: string
  ): {
    doctorId: string;
    doctorName: string;
    hospital?: string;
    revenue: number;
    orderCount: number;
  }[] {
    const doctorMap = new Map<
      string,
      {
        doctorName: string;
        hospital?: string;
        revenue: number;
        orderCount: number;
      }
    >();

    orders.forEach((order) => {
      if (order.items) {
        let orderRevenue = 0;
        let hasRepItems = false;

        order.items.forEach((item) => {
          if (String(item.repId) === String(repId)) {
            orderRevenue += (item.ptr || 0) * item.quantity;
            hasRepItems = true;
          }
        });

        if (hasRepItems && order.doctorName) {
          const doctorId = order.prescriptionId || order.id;
          const doctorName = order.doctorName || "Unknown";
          const hospital = order.hospital;

          if (!doctorMap.has(doctorId)) {
            doctorMap.set(doctorId, {
              doctorName,
              hospital,
              revenue: 0,
              orderCount: 0,
            });
          }

          const doctorStat = doctorMap.get(doctorId)!;
          doctorStat.revenue += orderRevenue;
          doctorStat.orderCount += 1;
        }
      }
    });

    return Array.from(doctorMap.entries())
      .map(([doctorId, stat]) => ({
        doctorId,
        ...stat,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  private static _calculateRevenueByTerritory(
    orders: IOrder[],
    repId: string
  ): {
    territoryId: string;
    territoryName: string;
    revenue: number;
    orderCount: number;
  }[] {
    return [];
  }

  private static _calculateRevenueByStatus(
    orders: IOrder[],
    repId: string
  ): {
    status: string;
    revenue: number;
    orderCount: number;
  }[] {
    const statusMap = new Map<
      string,
      { revenue: number; orderCount: number }
    >();

    orders.forEach((order) => {
      if (order.items) {
        let orderRevenue = 0;
        let hasRepItems = false;

        order.items.forEach((item) => {
          if (String(item.repId) === String(repId)) {
            orderRevenue += (item.ptr || 0) * item.quantity;
            hasRepItems = true;
          }
        });

        if (hasRepItems) {
          const status = order.status || "UNKNOWN";

          if (!statusMap.has(status)) {
            statusMap.set(status, { revenue: 0, orderCount: 0 });
          }

          const statusStat = statusMap.get(status)!;
          statusStat.revenue += orderRevenue;
          statusStat.orderCount += 1;
        }
      }
    });

    return Array.from(statusMap.entries())
      .map(([status, stat]) => ({
        status,
        ...stat,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  private static _calculateProductPerformance(
    orders: IOrder[],
    repId: string
  ): {
    productId: string;
    productName: string;
    revenue: number;
    unitsSold: number;
    averagePrice: number;
    orderCount: number;
  }[] {
    const productMap = new Map<
      string,
      {
        productName: string;
        revenue: number;
        unitsSold: number;
        orderCount: number;
      }
    >();

    orders.forEach((order) => {
      if (order.items) {
        const orderProducts = new Set<string>();

        order.items.forEach((item) => {
          if (String(item.repId) === String(repId)) {
            const productId = String(item.productId || "");
            const revenue = (item.ptr || 0) * item.quantity;

            if (!productMap.has(productId)) {
              productMap.set(productId, {
                productName: item.name || "Unknown",
                revenue: 0,
                unitsSold: 0,
                orderCount: 0,
              });
            }

            const productStat = productMap.get(productId)!;
            productStat.revenue += revenue;
            productStat.unitsSold += item.quantity;

            if (!orderProducts.has(productId)) {
              productStat.orderCount += 1;
              orderProducts.add(productId);
            }
          }
        });
      }
    });

    return Array.from(productMap.entries())
      .map(([productId, stat]) => ({
        productId,
        productName: stat.productName,
        revenue: stat.revenue,
        unitsSold: stat.unitsSold,
        averagePrice:
          stat.unitsSold > 0 ? stat.revenue / stat.unitsSold : 0,
        orderCount: stat.orderCount,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  private static _mapCommissionPeriodToPeriod(
    commissionPeriod: "weekly" | "monthly" | "yearly" | "custom"
  ): Period {
    switch (commissionPeriod) {
      case "weekly":
        return Period.WEEKLY;
      case "monthly":
        return Period.MONTHLY;
      case "yearly":
        return Period.YEARLY;
      case "custom":
        return Period.YEARLY;
      default:
        return Period.MONTHLY;
    }
  }
}

