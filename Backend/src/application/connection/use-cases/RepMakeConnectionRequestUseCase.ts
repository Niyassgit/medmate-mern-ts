import { NotFoundError } from "../../../domain/common/errors";
import { INotificationEventPublisher } from "../../../domain/common/services/INotificationEventPublisher";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import {
  ConnectionInitiator,
  ConnectionStatus,
  NotificationType,
  Role,
} from "../../../shared/Enums";
import {
  ErrorMessages,
  NotificationMessages,
  SuccessMessages,
} from "../../../shared/Messages";
import { BadRequestError } from "../../errors";
import { ANotificationMapper } from "../../notification/mappers/ANotificationMapper";
import { IRepMakeConnectionRequestUseCase } from "../interfaces/IMakeConnectionRequestUseCase";

export class RepMakeConnectionRequestUseCase
  implements IRepMakeConnectionRequestUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository,
    private _notificationRepository: INotificationRepository,
    private _storageService: IStorageService,
    private _notificationEventPublisher: INotificationEventPublisher
  ) {}
  async execute(doctorId: string, userId?: string): Promise<string> {
    if (!userId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const { doctorUserId } = await this._doctorRepository.getUserIdByDoctorId(
      doctorId
    );
    if (!doctorUserId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const existingConnection =
      await this._connectionRepository.findByDoctorAndRep(doctorId, repId);

    if (existingConnection) {
      if (existingConnection.status === ConnectionStatus.PENDING) {
        await this._connectionRepository.deleteByDoctorAndRep(doctorId, repId);
        const deletedNotificationId =
          await this._notificationRepository.deleteConnectionNotificationById(
            userId,
            doctorUserId
          );
        if (deletedNotificationId) {
          await this._notificationEventPublisher.deletePublishedNotification({
            notificationId: deletedNotificationId,
            receiverUserId: doctorUserId,
          });
        }
        return SuccessMessages.CANCEL_CONNECTION_REQ;
      }
      if (existingConnection.status === ConnectionStatus.ACCEPTED) {
        return ErrorMessages.ALREADY_CONNECTED;
      }
    }
    const requestRes = await this._connectionRepository.createConnection(
      doctorId,
      repId,
      ConnectionInitiator.REP
    );
    if (!requestRes)
      throw new BadRequestError(ErrorMessages.CONNECTION_REQUEST);
    const notification = await this._notificationRepository.createNotification(
      userId,
      Role.MEDICAL_REP,
      doctorUserId,
      Role.DOCTOR,
      NotificationType.CONNECTION_REQUEST,
      NotificationMessages.CONNECTION_REQ_NOTIFICATION_MESSAGE
    );
    const fullNotification =
      await this._notificationRepository.findNotificationById(notification.id);
    if (!fullNotification)
      throw new NotFoundError(ErrorMessages.NOTIFICATION_NOT_FOUND);
    const mappedNotification = await ANotificationMapper.toDomain(
      fullNotification,
      this._storageService
    );
    await this._notificationEventPublisher.publishNotification({
      ...mappedNotification,
      receiverUserId: doctorUserId,
    });
    return SuccessMessages.CONNECTION_REQUEST;
  }
}
