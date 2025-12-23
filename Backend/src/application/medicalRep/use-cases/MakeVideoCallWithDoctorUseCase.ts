import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IVideoCallEventPublisher } from "../../../domain/common/services/IVideoCallEventPublisher";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { IMakeVideoCallWithDoctorUseCase } from "../interfaces/IMakeVideoCallWithDoctorUseCase";

export class MakeVideoCallWithDoctorUseCase
  implements IMakeVideoCallWithDoctorUseCase
{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _videoCallEventPublisher: IVideoCallEventPublisher
  ) {}
  async execute(doctorId: string, userId?: string): Promise<void> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { doctorUserId } = await this._doctorRepository.getUserIdByDoctorId(
      doctorId
    );
    if (!doctorUserId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

    await this._videoCallEventPublisher.publishIncomingCall(
      doctorUserId,
      userId,
    );
  }
}
