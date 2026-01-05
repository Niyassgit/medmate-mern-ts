import { Period, Trend } from "../../../shared/Enums";

export interface GrowthMetricsDTO {
  previousPeriodRevenue: number;
  currentPeriodRevenue: number;
  growthPercentage: number;
  growthAmount: number;
  period:Period;
  trend:Trend;
}