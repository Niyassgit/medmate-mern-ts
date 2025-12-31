import { ProrationDetailsDTO } from "../dto/ProrationDetailsDTO";

export interface IUpgradeSubscriptionPlanUseCase {
  execute(
    newPlanId: string,
    userId?: string
  ): Promise<{ checkoutUrl: string; prorationDetails: ProrationDetailsDTO }>;
}
