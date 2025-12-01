import { createSubscriptionDTO } from "../dto/createSubscriptionDTO";

export interface ICreateSubscriptionPlanUseCase {
  execute(dto:createSubscriptionDTO, userId?: string): Promise<string>;
}
