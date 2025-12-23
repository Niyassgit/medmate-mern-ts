import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IVideoCallEventPublisher } from "../../../domain/common/services/IVideoCallEventPublisher";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { SessionDescription } from "../../../shared/videoCall/SessionDescription";
import { IAcceptDoctorVidoeCallRequestUseCase } from "../interfaces/IAcceptDoctorVidoeCallRequestUseCase";

export class AccepDoctorVideoCallRequestUseCase
  implements IAcceptDoctorVidoeCallRequestUseCase
{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _videoVallPublishEvent: IVideoCallEventPublisher
  ) {}
  async execute(
    doctorId: string,
    answer: SessionDescription,
    userId?: string
  ): Promise<void> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { doctorUserId } = await this._doctorRepository.getUserIdByDoctorId(
      doctorId
    );
    if (!doctorUserId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    await this._videoVallPublishEvent.publishCallAccepted(
      doctorUserId,
      userId,
      answer
    );
  }
}
