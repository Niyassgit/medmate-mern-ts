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
import { BadRequestError, UnautharizedError } from "../../errors";
import { ANotificationMapper } from "../../notification/mappers/ANotificationMapper";
import { IDoctorConnectionRequestUseCase } from "../interfaces/IDoctorConnectionRequestUseCase";

export class DoctorConnectionRequestUseCase
  implements IDoctorConnectionRequestUseCase
{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _medicalRepRepository: IMedicalRepRepository,
    private _connectionRepository: IConnectionRepository,
    private _notificationRepository: INotificationRepository,
    private _notificationEventPublisher: INotificationEventPublisher,
    private _storageSerive: IStorageService
  ) {}

  async execute(repId: string, userId?: string): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    if (!doctorId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const { repUserId } = await this._medicalRepRepository.getUserIdByRepId(
      repId
    );
    if (!repUserId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const existingConnection =
      await this._connectionRepository.findByDoctorAndRep(doctorId, repId);
    if (existingConnection) {
      if (existingConnection.status === ConnectionStatus.PENDING) {
        await this._connectionRepository.deleteByDoctorAndRep(doctorId, repId);
        const deltedNotificationId =
          await this._notificationRepository.deleteConnectionNotificationById(
            userId,
            repUserId
          );
        if (deltedNotificationId) {
          await this._notificationEventPublisher.deletePublishedNotification({
            notificationId: deltedNotificationId,
            receiverUserId: repUserId,
          });
        }
        const unReadCount =
          await this._notificationRepository.getCountOfUnreadNotification(
            repUserId
          );
        await this._notificationEventPublisher.unreadNotificationCount({
          receiverUserId: repUserId,
          count: unReadCount,
        });
        return SuccessMessages.CANCEL_CONNECTION_REQ;
      }
      if (existingConnection.status === ConnectionStatus.ACCEPTED) {
        return ErrorMessages.ALREADY_CONNECTED;
      }
    }
    const connection = await this._connectionRepository.createConnection(
      doctorId,
      repId,
      ConnectionInitiator.DOCTOR
    );
    if (!connection)
      throw new BadRequestError(ErrorMessages.CONNECTION_REQUEST);
    const notification = await this._notificationRepository.createNotification(
      userId,
      Role.DOCTOR,
      repUserId,
      Role.MEDICAL_REP,
      NotificationType.CONNECTION_REQUEST,
      NotificationMessages.CONNECTION_REQ_NOTIFICATION_MESSAGE
    );
    const fullNotification =
      await this._notificationRepository.findNotificationById(notification.id);
    if (!fullNotification)
      throw new NotFoundError(ErrorMessages.NOTIFICATION_NOT_FOUND);
    const mappedNotification = await ANotificationMapper.toDomain(
      fullNotification,
      this._storageSerive
    );
    const unReadCount =
      await this._notificationRepository.getCountOfUnreadNotification(
        repUserId
      );
    await this._notificationEventPublisher.unreadNotificationCount({
      receiverUserId: repUserId,
      count: unReadCount,
    });
    await this._notificationEventPublisher.publishNotification({
      ...mappedNotification,
      receiverUserId: repUserId,
    });

    return SuccessMessages.CONNECTION_REQUEST;
  }
}
