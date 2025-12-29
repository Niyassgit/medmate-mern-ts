import { UnautharizedError } from "../../../domain/common/errors";
import { ISubscriptionRepositoy } from "../../../domain/subscription/repositories/ISubscriptionRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { CreateSubscriptionDTO } from "../dto/CreateSubscriptionDTO";
import { SubscriptionDTO } from "../dto/SubscriptionDTO";
import { ICreateSubscriptionPlanUseCase } from "../interfaces/ICreateSubscriptionPlanUseCase";
import { SubscriptionMapper } from "../mappers/SubscriptionMapper";

export class CreateSubscriptionPlanUseCase implements ICreateSubscriptionPlanUseCase {
  constructor(private _subscriptionRepository: ISubscriptionRepositoy) {}
  async execute(dto: CreateSubscriptionDTO, userId?: string): Promise<SubscriptionDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const mappedPlan = SubscriptionMapper.toEntity(dto);
    const result = await this._subscriptionRepository.createSubscription(
      mappedPlan
    );
    if (!result) throw new Error(ErrorMessages.SUB_CREATE_ERROR);
    return SubscriptionMapper.toDomain(result);
  }
}
 