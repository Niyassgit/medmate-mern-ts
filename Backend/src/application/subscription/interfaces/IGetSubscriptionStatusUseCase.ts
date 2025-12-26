import { SubscriptionStatusDTO } from "../dto/SubscriptionStatusDTO";

export interface IGetSubscriptionStatusUseCase {
  execute(userId?: string): Promise<SubscriptionStatusDTO>;
}





















