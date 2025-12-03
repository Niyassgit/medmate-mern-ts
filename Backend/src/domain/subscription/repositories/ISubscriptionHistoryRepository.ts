import { ISubscriptionHistory } from "../entities/ISubscriptionHistory";

export interface ISubscriptionHistoryRepository {
  createHistory(
    data: Omit<ISubscriptionHistory, "id">
  ): Promise<ISubscriptionHistory>;
  findHistoryById(SubHisId: string): Promise<ISubscriptionHistory | null>;
  findHistoriesByRepId(repId: string): Promise<ISubscriptionHistory[] | null>;
  findAllPlans(): Promise<ISubscriptionHistory[]>;
  getRevenueByTier(
    startDate?: Date,
    endDate?: Date
  ): Promise<{ tierName: string; revenue: number }[]>;
  getRecentSubscriptions(
    limit: number
  ): Promise<
    {
      userId: string;
      name: string;
      tier: string;
      amount: number;
      date: Date;
      status: string;
    }[]
  >;
}
