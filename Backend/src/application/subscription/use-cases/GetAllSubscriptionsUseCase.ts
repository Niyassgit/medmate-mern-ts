import { UnautharizedError } from "../../../domain/common/errors";
import { ISubscriptionRepository } from "../../../domain/subscription/repositories/ISubscriptionRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { SubscriptionDTO } from "../dto/SubscriptionDTO";
import { IGetAllSubscriptionsUseCase } from "../interfaces/IGetAllSubscriptionsUseCase";
import { SubscriptionMapper } from "../mappers/SubscriptionMapper";

export class GetAllSubscriptionsUseCase implements IGetAllSubscriptionsUseCase{
    constructor(
      private _subscriptionRepository:ISubscriptionRepository,

    ){}
    async execute(userId?: string): Promise<SubscriptionDTO[]> {
        if(!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
        const subscriptions=await this._subscriptionRepository.getAllSubscriptions();
        const mappedSubscriptions=SubscriptionMapper.toListDomain(subscriptions);
        return mappedSubscriptions;

    }
}