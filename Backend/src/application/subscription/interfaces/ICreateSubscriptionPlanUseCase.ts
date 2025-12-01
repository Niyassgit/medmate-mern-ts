import { CreateSubscriptionDTO } from "../dto/CreateSubscriptionDTO";

export interface ICreateSubscriptionPlanUseCase {
  execute(dto: CreateSubscriptionDTO, userId?: string): Promise<string>;
}
