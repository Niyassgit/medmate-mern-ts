import { NotFoundError } from "../../../domain/common/errors";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ConnectionStatus, NotificationType } from "../../../shared/Enums";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { UnautharizedError } from "../../errors";
import { IRepRejectConnectionUseCase } from "../interfaces/IRepRejectConnnectionUseCase";

export class RepRejectConnectionUseCase implements IRepRejectConnectionUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _conectionRepository: IConnectionRepository,
    private _notificationRepository: INotificationRepository
  ) {}
  async execute(
    doctoId: string,
    notificationId: string,
    userId?: string
  ): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const result =
      await this._conectionRepository.rejectConnectionByDoctorAndRepIds(
        doctoId,
        repId,
        ConnectionStatus.REJECTED
      );
    if (!result) return ErrorMessages.CONNECTION_REJECT_FAILED;
    const updated = await this._notificationRepository.updateNotificationById(
      notificationId,
      NotificationType.CONNECTION_REJECT
    );
    if(!updated) return ErrorMessages.CONNECTION_REJECT_FAILED;
    return SuccessMessages.CONNECTION_REJECT;
  }
}
