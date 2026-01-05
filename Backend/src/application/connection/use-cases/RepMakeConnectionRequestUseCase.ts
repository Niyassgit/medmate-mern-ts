import { NotFoundError, BadRequestError } from "../../../domain/common/errors";
import { INotificationEventPublisher } from "../../../domain/common/services/INotificationEventPublisher";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IConnectionRequestLogRepository } from "../../../domain/connection/repositories/IConnectionRequestLogRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ISubscriptionRepository } from "../../../domain/subscription/repositories/ISubscriptionRepository";
import {
  ConnectionInitiator,
  ConnectionStatus,
  Feature,
  NotificationType,
  Role,
} from "../../../shared/Enums";
import {
  ErrorMessages,
  NotificationMessages,
  SuccessMessages,
} from "../../../shared/Messages";
import { PermissionService } from "../../common/services/PermissionService";
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
    private _notificationEventPublisher: INotificationEventPublisher,
    private _connectionRequestLogRepository: IConnectionRequestLogRepository,
    private _subscriptionRepository: ISubscriptionRepository
  ) {}
  async execute(doctorId: string, userId?: string): Promise<string> {
    if (!userId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const repDetails = await this._medicalRepRepository.getMedicalRepById(
      repId
    );

    if (!repDetails) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const { doctorUserId } = await this._doctorRepository.getUserIdByDoctorId(
      doctorId
    );
    if (!doctorUserId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const existingConnection =
      await this._connectionRepository.findByDoctorAndRep(doctorId, repId);

    if (existingConnection) {
      if (existingConnection.status === ConnectionStatus.PENDING) {
        if (existingConnection.initiator === ConnectionInitiator.REP) {
          await this._connectionRequestLogRepository.decrementRequestCount(
            repId
          );
        }

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

          const unreadCount =
            await this._notificationRepository.getCountOfUnreadNotification(
              doctorUserId
            );
          await this._notificationEventPublisher.unreadNotificationCount({
            receiverUserId: doctorUserId,
            count: unreadCount,
          });
        }
        return SuccessMessages.CANCEL_CONNECTION_REQ;
      }
      if (existingConnection.status === ConnectionStatus.ACCEPTED) {
        return ErrorMessages.ALREADY_CONNECTED;
      }
    }

    const DEFAULT_CONNECTION_LIMIT = 3;

    const hasUnlimitedConnections = await PermissionService.hasFeatureForRep(
      repDetails,
      Feature.UNLIMITED_CONNECTIONS,
      this._subscriptionRepository
    );

    if (!hasUnlimitedConnections) {
      const todayCount =
        await this._connectionRequestLogRepository.getTodayRequestCount(repId);

      if (todayCount >= DEFAULT_CONNECTION_LIMIT) {
        throw new BadRequestError(ErrorMessages.CONNECTION_LIMIT);
      }
    }

    const requestRes = await this._connectionRepository.createConnection(
      doctorId,
      repId,
      ConnectionInitiator.REP
    );
    if (!requestRes)
      throw new BadRequestError(ErrorMessages.CONNECTION_REQUEST);

    if (!hasUnlimitedConnections) {
      await this._connectionRequestLogRepository.incrementRequestCount(repId);
    }

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
    const unreadCount =
      await this._notificationRepository.getCountOfUnreadNotification(
        doctorUserId
      );
    await this._notificationEventPublisher.unreadNotificationCount({
      receiverUserId: doctorUserId,
      count: unreadCount,
    });
    await this._notificationEventPublisher.publishNotification({
      ...mappedNotification,
      receiverUserId: doctorUserId,
    });
    return SuccessMessages.CONNECTION_REQUEST;
  }
}
