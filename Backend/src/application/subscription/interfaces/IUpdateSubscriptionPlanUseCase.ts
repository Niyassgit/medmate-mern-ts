import { CreateSubscriptionDTO } from "../dto/CreateSubscriptionDTO";
import { SubscriptionsDTO } from "../dto/SubscriptionDTO";

export interface IUpdateSubscriptionPlanUseCase {
  execute(
    subscriptionId: string,
    data: CreateSubscriptionDTO,
    userId?: string
  ): Promise<SubscriptionsDTO>;
}
