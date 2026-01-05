import { ISubscriptionHistory } from "../../../domain/subscription/entities/ISubscriptionHistory";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ISubscriptionHistoryRepository } from "../../../domain/subscription/repositories/ISubscriptionHistoryRepository";
import { IGetSubscriptionHistoryUseCase } from "../interfaces/IGetSubscriptionHistoryUseCase";
import { BadRequestError } from "../../errors";
import { ErrorMessages } from "../../../shared/Messages";
import { UnautharizedError } from "../../../domain/common/errors";

export class GetSubscriptionHistoryUseCase
  implements IGetSubscriptionHistoryUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _subscriptionHistoryRepository: ISubscriptionHistoryRepository
  ) {}

  async execute(userId?: string): Promise<ISubscriptionHistory[]> {
    if (!userId) {
      throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    }
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    
    if (!repId) {
      throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    }

    const history = await this._subscriptionHistoryRepository.findHistoriesByRepId(repId);
    return history || [];
  }
}

