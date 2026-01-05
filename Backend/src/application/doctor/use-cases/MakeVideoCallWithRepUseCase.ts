import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IVideoCallEventPublisher } from "../../../domain/common/services/IVideoCallEventPublisher";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ISubscriptionRepository } from "../../../domain/subscription/repositories/ISubscriptionRepository";
import { Feature } from "../../../shared/Enums";
import { ErrorMessages } from "../../../shared/Messages";
import { IMakeVideoCallWithRepUseCase } from "../interfaces/IMakeVideoCallWithrepUseCase";

export class MakeVideoCallWithRepUseCase
  implements IMakeVideoCallWithRepUseCase
{
  constructor(
    private _videoCallEventPubnlisher: IVideoCallEventPublisher,
    private _medicalRepRepository: IMedicalRepRepository,
    private _subscriptionRepository: ISubscriptionRepository
  ) {}
  async execute(repId: string, userId?: string): Promise<string | void> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { repUserId } = await this._medicalRepRepository.getUserIdByRepId(
      repId
    );
    const medicalRep = await this._medicalRepRepository.getMedicalRepById(
      repId
    );
    if (
      !medicalRep?.subscriptionStatus ||
      !medicalRep?.subscriptionEnd ||
      !medicalRep.subscriptionPlanId ||
      new Date() > new Date(medicalRep.subscriptionEnd)
    )
      return ErrorMessages.REP_SUBSCRIPTION_NEEDED;

    const repValidPlan =
      await this._subscriptionRepository.findSubscriptionById(
        medicalRep.subscriptionPlanId
      );
    if (!repValidPlan?.features.includes(Feature.VIDEO_CALL))
      return ErrorMessages.REP_SUB_INACTIVE;

    if (!repUserId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    await this._videoCallEventPubnlisher.publishIncomingCall(repUserId, userId);
  }
}
