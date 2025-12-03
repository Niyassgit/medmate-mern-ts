import { ISubscriptionHistoryRepository } from "../../../domain/subscription/repositories/ISubscriptionHistoryRepository";
import { RevenueByTierDTO } from "../dto/RevenueByTierDTO";
import { IGetRevenueByTierUseCase } from "../interfaces/IGetRevenueByTierUseCase";
import { UnautharizedError } from "../../errors";
import { ErrorMessages } from "../../../shared/Messages";

export class GetRevenueByTierUseCase implements IGetRevenueByTierUseCase {
  constructor(
    private _subscriptionHistoryRepository: ISubscriptionHistoryRepository
  ) {}

  async execute(
    userId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<RevenueByTierDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const now = new Date();
    const parsedStartDate = startDate 
      ? new Date(startDate) 
      : new Date(now.getFullYear(), 0, 1); 
    const parsedEndDate = endDate 
      ? new Date(endDate) 
      : new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); 

    const revenueData = await this._subscriptionHistoryRepository.getRevenueByTier(
      parsedStartDate,
      parsedEndDate
    );

    const tiers: string[] = [];
    const revenue: number[] = [];

    revenueData.forEach((item) => {
      tiers.push(item.tierName);
      revenue.push(item.revenue);
    });

    return {
      tiers,
      revenue,
    };
  }
}

