import { CreateSubscriptionDTO } from "../dto/CreateSubscriptionDTO";
import { SubscriptionDTO } from "../dto/SubscriptionDTO";

export interface IUpdateSubscriptionPlanUseCase {
  execute(
    subscriptionId: string,
    data: CreateSubscriptionDTO,
    userId?: string
  ): Promise<SubscriptionDTO>;
}
