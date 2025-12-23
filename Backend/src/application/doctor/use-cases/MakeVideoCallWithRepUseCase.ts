import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IVideoCallEventPublisher } from "../../../domain/common/services/IVideoCallEventPublisher";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { IMakeVideoCallWithRepUseCase } from "../interfaces/IMakeVideoCallWithrepUseCase";

export class MakeVideoCallWithRepUseCase
  implements IMakeVideoCallWithRepUseCase
{
  constructor(
    private _videoCallEventPubnlisher: IVideoCallEventPublisher,
    private _medicalRepRepository: IMedicalRepRepository
  ) {}
  async execute(repId: string, userId?: string): Promise<void> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { repUserId } = await this._medicalRepRepository.getUserIdByRepId(
      repId
    );
    if (!repUserId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    await this._videoCallEventPubnlisher.publishIncomingCall(repUserId, userId);
    
  }
}
