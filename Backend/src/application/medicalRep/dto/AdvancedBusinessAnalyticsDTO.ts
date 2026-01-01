import { RepBusinessStatDTO } from "./RepBusinessStatDTO";
import { RevenueTimelineEntry } from "../../superAdmin/utils/RevenuePeriodUtil";
import { Period } from "../../../shared/Enums";

export interface AdvancedBusinessAnalyticsDTO extends RepBusinessStatDTO {
  revenueTimeline?: RevenueTimelineEntry[];

  growthMetrics?: {
    previousPeriodRevenue: number;
    currentPeriodRevenue: number;
    growthPercentage: number;
    growthAmount: number;
    period: Period;
  };
  
  revenueByDoctor?: {
    doctorId: string;
    doctorName: string;
    hospital?: string;
    revenue: number;
    orderCount: number;
  }[];
  
  revenueByTerritory?: {
    territoryId: string;
    territoryName: string;
    revenue: number;
    orderCount: number;
  }[];
  
  revenueByStatus?: {
    status: string;
    revenue: number;
    orderCount: number;
  }[];
  

  productPerformance?: {
    productId: string;
    productName: string;
    revenue: number;
    unitsSold: number;
    averagePrice: number;
    orderCount: number;
  }[];
}