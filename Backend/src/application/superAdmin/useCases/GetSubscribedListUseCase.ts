import { ISubscriptionHistoryRepository } from "../../../domain/subscription/repositories/ISubscriptionHistoryRepository";
import { SubscribedListResponse } from "../dto/SubscribedListDTO";
import { IGetSubscribedListUseCase } from "../interfaces/IGetSubscribedListUseCase";
import { UnautharizedError } from "../../errors";
import { ErrorMessages } from "../../../shared/Messages";

export class GetSubscribedListUseCase implements IGetSubscribedListUseCase {
  constructor(
    private _subscriptionHistoryRepository: ISubscriptionHistoryRepository
  ) {}

  async execute(
    userId?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<SubscribedListResponse> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const result = await this._subscriptionHistoryRepository.getSubscribedList(
      page,
      limit
    );

    return result;
  }
}

