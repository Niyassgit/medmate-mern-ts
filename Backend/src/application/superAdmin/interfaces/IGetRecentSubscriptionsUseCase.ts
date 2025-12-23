import { RecentSubscriptionDTO } from "../dto/RecentSubscriptionDTO";

export interface IGetRecentSubscriptionsUseCase {
  execute(userId?: string, limit?: number): Promise<RecentSubscriptionDTO>;
}

















