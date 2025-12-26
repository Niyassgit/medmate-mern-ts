import { ISubscriptionHistoryRepository } from "../../../domain/subscription/repositories/ISubscriptionHistoryRepository";
import { RecentSubscriptionDTO } from "../dto/RecentSubscriptionDTO";
import { IGetRecentSubscriptionsUseCase } from "../interfaces/IGetRecentSubscriptionsUseCase";
import { UnautharizedError } from "../../errors";
import { ErrorMessages } from "../../../shared/Messages";

export class GetRecentSubscriptionsUseCase implements IGetRecentSubscriptionsUseCase {
  constructor(
    private _subscriptionHistoryRepository: ISubscriptionHistoryRepository
  ) {}

  async execute(userId?: string, limit: number = 20): Promise<RecentSubscriptionDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const recentSubscriptions = await this._subscriptionHistoryRepository.getRecentSubscriptions(limit);

    return recentSubscriptions;
  }
}




















