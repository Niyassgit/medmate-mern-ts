import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { ISubscriptionRepository } from "../../../domain/subscription/repositories/ISubscriptionRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { IListToggleSubscriptionPlanUseCase } from "../interfaces/IListToggleSubscriptionPlanUseCase";

export class ListToggleSubscriptionPlanUseCase
  implements IListToggleSubscriptionPlanUseCase
{
  constructor(private _subscriptionRepository: ISubscriptionRepository) {}

  async execute(
    subscriptionId: string,
    userId?: string
  ): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const plan = await this._subscriptionRepository.findSubscriptionById(
      subscriptionId
    );
    if (!plan) throw new BadRequestError(ErrorMessages.SUB_NOT_FOUND);

    const updatedPlan = await this._subscriptionRepository.toggleListStatus(
      subscriptionId,
      !plan.isActive
    );

    if(!updatedPlan) return ErrorMessages.SUB_UPDATE_ERROR;
    return SuccessMessages.SUB_UPDATED;
  }
}
