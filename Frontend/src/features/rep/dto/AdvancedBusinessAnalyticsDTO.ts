import { RepStatAnalyticsDTO } from "./RepStatAnalyticsDTO";

export enum Period {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface RevenueTimelineEntry {
  period: string;
  amount: number;
}

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

export interface RevenueByTerritory {
  territoryId: string;
  territoryName: string;
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

export interface AdvancedBusinessAnalyticsDTO extends RepStatAnalyticsDTO {
  // Revenue Timeline Data
  revenueTimeline?: RevenueTimelineEntry[];
  
  // Growth Metrics
  growthMetrics?: GrowthMetrics;
  
  // Revenue Breakdowns
  revenueByDoctor?: RevenueByDoctor[];
  
  revenueByTerritory?: RevenueByTerritory[];
  
  revenueByStatus?: RevenueByStatus[];
  
  // Product Performance
  productPerformance?: ProductPerformance[];
}

