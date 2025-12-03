import { ISubscriptionHistory } from "../../../domain/subscription/entities/ISubscriptionHistory";

export interface IGetSubscriptionHistoryUseCase {
  execute(userId?: string): Promise<ISubscriptionHistory[]>;
}

  