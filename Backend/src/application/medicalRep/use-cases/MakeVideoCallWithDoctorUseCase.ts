import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IVideoCallEventPublisher } from "../../../domain/common/services/IVideoCallEventPublisher";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { IMakeVideoCallWithDoctorUseCase } from "../interfaces/IMakeVideoCallWithDoctorUseCase";

export class MakeVideoCallWithDoctorUseCase
  implements IMakeVideoCallWithDoctorUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _videoCallEventPublisher: IVideoCallEventPublisher,
    private _medicalRepRepository: IMedicalRepRepository
  ) { }
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
    )
      return ErrorMessages.SUBSCRIPTION_PLAN_NEEDED;

    await this._videoCallEventPublisher.publishIncomingCall(
      doctorUserId,
      userId
    );
  }
}
