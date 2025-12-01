import { UnautharizedError } from "../../../domain/common/errors";
import { ISubscriptionRepositoy } from "../../../domain/subscription/repositories/ISubscriptionRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { IDeleteSubscriptionUseCase } from "../interfaces/IDeleteSubscriptionUseCase";

export class DeleteSubscriptionPlanUseCase
  implements IDeleteSubscriptionUseCase
{
  constructor(private _subscriptionRepository: ISubscriptionRepositoy) {}
  async execute(subscriptionId: string, userId?: string): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const existing = await this._subscriptionRepository.findSubscriptionById(
      subscriptionId
    );
    if (!existing) {
      throw new Error(ErrorMessages.SUB_NOT_FOUND);
    }

    await this._subscriptionRepository.deleteSubscriptionById(subscriptionId);
    return SuccessMessages.SUB_DELETED;
  }
}
