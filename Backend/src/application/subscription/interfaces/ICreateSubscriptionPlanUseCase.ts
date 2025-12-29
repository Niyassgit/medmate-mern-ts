import { CreateSubscriptionDTO } from "../dto/CreateSubscriptionDTO";
import { SubscriptionDTO } from "../dto/SubscriptionDTO";

export interface ICreateSubscriptionPlanUseCase {
  execute(dto: CreateSubscriptionDTO, userId?: string): Promise<SubscriptionDTO>;
}
