import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { ISubscriptionRepositoy } from "../../../domain/subscription/repositories/ISubscriptionRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { CreateSubscriptionDTO } from "../dto/CreateSubscriptionDTO";
import { SubscriptionDTO } from "../dto/SubscriptionDTO";
import { IUpdateSubscriptionPlanUseCase } from "../interfaces/IUpdateSubscriptionPlanUseCase";
import { SubscriptionMapper } from "../mappers/SubscriptionMapper";

export class UpdateSubscriptionPlanUseCase
  implements IUpdateSubscriptionPlanUseCase
{
  constructor(private _subscriptionRepository: ISubscriptionRepositoy) {}
  async execute(
    subscriptionId: string,
    data: CreateSubscriptionDTO,
    userId?: string
  ): Promise<SubscriptionDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const plan = await this._subscriptionRepository.findSubscriptionById(
      subscriptionId
    );
    if (!plan) throw new BadRequestError(ErrorMessages.SUB_NOT_FOUND);
    const mappedData = SubscriptionMapper.toEntity(data);
    const result = await this._subscriptionRepository.updateSubscriptionPlan(
      subscriptionId,
      mappedData
    );
    return result;
  }
}
