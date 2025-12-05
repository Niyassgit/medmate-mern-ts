import { ISubscriptionHistoryRepository } from "../../../domain/subscription/repositories/ISubscriptionHistoryRepository";
import { RevenueByTierDTO } from "../dto/RevenueByTierDTO";
import { IGetRevenueByTierUseCase } from "../interfaces/IGetRevenueByTierUseCase";
import { UnautharizedError } from "../../errors";
import { ErrorMessages } from "../../../shared/Messages";
import { getDateRange } from "../../../shared/DateRange";

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

   const {parsedStartDate,parsedEndDate}=getDateRange(startDate,endDate);

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

