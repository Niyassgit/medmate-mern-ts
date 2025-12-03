import { RevenueByTierDTO } from "../dto/RevenueByTierDTO";

export interface IGetRevenueByTierUseCase {
  execute(userId?: string, startDate?: string, endDate?: string): Promise<RevenueByTierDTO>;
}

