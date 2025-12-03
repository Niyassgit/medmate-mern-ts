import { ISubscriptionHistoryRepository } from "../../../domain/subscription/repositories/ISubscriptionHistoryRepository";
import { CreateSubHistoryDTO } from "../dto/CreateSubHistoryDTO";
import { ICreateSubscriptionHistoryUseCase } from "../interfaces/ICreateSubscriptionHistoryUseCase";
import { SubscriptionHistoryMapper } from "../mappers/SubscriptionHistoryMapper";

export class CreateSubscriptionHistoryUseCase
  implements ICreateSubscriptionHistoryUseCase
{
  constructor(
    private _subscriptionHistoryRepository: ISubscriptionHistoryRepository
  ) {}
  async execute(dto: CreateSubHistoryDTO): Promise<void> {
    const mappedPlan = SubscriptionHistoryMapper.toEntity(dto);
    await this._subscriptionHistoryRepository.createHistory(mappedPlan);
  }
}

