import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ConnectionStatus, NotificationType } from "../../../shared/Enums";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, NotFoundError } from "../../errors";
import { IRepAcceptConnOnNotUseCase } from "../interfaces/IRepAcceptConnOnNotUseCase";

export class RepAcceptConnOnNotUseCase implements IRepAcceptConnOnNotUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _connectionRepository: IConnectionRepository,
    private _notificationRepository: INotificationRepository
  ) {}

  async execute(
    doctorId: string,
    notificationId: string,
    userId?: string
  ): Promise<string> {
    if (!userId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);

    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);

    const existingConnection =
      await this._connectionRepository.findByDoctorAndRep(doctorId, repId);

    if (!existingConnection)
      throw new BadRequestError(ErrorMessages.NO_CONNECTION_REQUEST_FOUND);

    if (existingConnection.status === ConnectionStatus.ACCEPTED)
      return ErrorMessages.ALREADY_CONNECTED;

    await this._connectionRepository.updateStatus(
      doctorId,
      repId,
      ConnectionStatus.ACCEPTED
    );

    await this._notificationRepository.updateNotificationById(
      notificationId,
      NotificationType.CONNECTION_ACCEPTED
    );

    return SuccessMessages.CONNECTED;
  }
}
