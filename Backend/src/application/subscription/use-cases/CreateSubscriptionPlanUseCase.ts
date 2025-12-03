import { UnautharizedError } from "../../../domain/common/errors";
import { ISubscriptionRepositoy } from "../../../domain/subscription/repositories/ISubscriptionRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { CreateSubscriptionDTO } from "../dto/CreateSubscriptionDTO";
import { ICreateSubscriptionPlanUseCase } from "../interfaces/ICreateSubscriptionPlanUseCase";
import { SubscriptionMapper } from "../mappers/SubscriptionMapper";

export class CreateSubscriptionPlanUseCase implements ICreateSubscriptionPlanUseCase {
  constructor(private _subscriptionRepository: ISubscriptionRepositoy) {}
  async execute(dto: CreateSubscriptionDTO, userId?: string): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const mappedPlan = SubscriptionMapper.toEntity(dto);
    const result = await this._subscriptionRepository.createSubscription(
      mappedPlan
    );
    if (!result) return ErrorMessages.SUB_CREATE_ERROR;
    return SuccessMessages.SUB_PLAN_CREATE_SUCCESS;
  }
}
 