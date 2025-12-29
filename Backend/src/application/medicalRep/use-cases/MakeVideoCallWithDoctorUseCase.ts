import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IVideoCallEventPublisher } from "../../../domain/common/services/IVideoCallEventPublisher";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ISubscriptionRepositoy } from "../../../domain/subscription/repositories/ISubscriptionRepository";
import { Feature } from "../../../shared/Enums";
import { ErrorMessages } from "../../../shared/Messages";
import { IMakeVideoCallWithDoctorUseCase } from "../interfaces/IMakeVideoCallWithDoctorUseCase";

export class MakeVideoCallWithDoctorUseCase
  implements IMakeVideoCallWithDoctorUseCase
{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _videoCallEventPublisher: IVideoCallEventPublisher,
    private _medicalRepRepository: IMedicalRepRepository,
    private _subscriptionRepository: ISubscriptionRepositoy
  ) {}

  async execute(doctorId: string, userId?: string): Promise<string | void> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const { doctorUserId } = await this._doctorRepository.getUserIdByDoctorId(
      doctorId
    );
    if (!doctorUserId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

    const medicalRep = await this._medicalRepRepository.getMedicalRepByUserId(
      userId
    );
    if (
      !medicalRep?.subscriptionStatus ||
      !medicalRep?.subscriptionEnd ||
      new Date() > new Date(medicalRep.subscriptionEnd)
    ) {
      return ErrorMessages.SUBSCRIPTION_PLAN_NEEDED;
    }

    const planId = medicalRep.subscriptionPlanId;
    if (!planId) {
      return ErrorMessages.SUBSCRIPTION_PLAN_NEEDED;
    }

    const plan = await this._subscriptionRepository.findSubscriptionById(
      planId
    );
    if (!plan || !plan.features.includes(Feature.VIDEO_CALL)) {
      return ErrorMessages.FEATURE_NOT_AVAILABLE;
    }

    await this._videoCallEventPublisher.publishIncomingCall(
      doctorUserId,
      userId
    );
  }
}
