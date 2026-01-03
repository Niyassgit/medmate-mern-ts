import { RepBusinessStatDTO } from "./RepBusinessStatDTO";
import { RevenueTimelineEntry } from "../../superAdmin/utils/RevenuePeriodUtil";
import { Period } from "../../../shared/Enums";

export interface GrowthMetrics {
  previousPeriodRevenue: number;
  currentPeriodRevenue: number;
  growthPercentage: number;
  growthAmount: number;
  period: Period;
}

export interface RevenueByDoctor {
  doctorId: string;
  doctorName: string;
  hospital?: string;
  revenue: number;
  orderCount: number;
}

export interface RevenueByStatus {
  status: string;
  revenue: number;
  orderCount: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  revenue: number;
  unitsSold: number;
  averagePrice: number;
  orderCount: number;
}

export interface AdvancedBusinessAnalyticsDTO extends RepBusinessStatDTO {
  revenueTimeline?: RevenueTimelineEntry[];
  growthMetrics?: GrowthMetrics;
  revenueByDoctor?: RevenueByDoctor[];
  revenueByStatus?: RevenueByStatus[];
  productPerformance?: ProductPerformance[];
}