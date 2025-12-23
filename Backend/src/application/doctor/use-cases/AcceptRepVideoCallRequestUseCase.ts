import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IVideoCallEventPublisher } from "../../../domain/common/services/IVideoCallEventPublisher";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { SessionDescription } from "../../../shared/videoCall/SessionDescription";
import { IAcceptRepVideoCallRequestUseCase } from "../interfaces/IAcceptRepVideoCallRequestUseCase";

export class AcceptRepVideoCallRequestUseCase
  implements IAcceptRepVideoCallRequestUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _videoCallEventPublishEvent: IVideoCallEventPublisher
  ) {}
  async execute(
    repId: string,
    answer: SessionDescription,
    userId?: string
  ): Promise<void> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { repUserId } = await this._medicalRepRepository.getUserIdByRepId(
      repId
    );
    if (!repUserId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    await this._videoCallEventPublishEvent.publishCallAccepted(
      repUserId,
      userId,
      answer
    );
  }
}
