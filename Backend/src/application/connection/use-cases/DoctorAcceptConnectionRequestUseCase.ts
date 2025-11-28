import { IConversationRepository } from "../../../domain/chat/respositories/IConversationRepository";
import { INotificationEventPublisher } from "../../../domain/common/services/INotificationEventPublisher";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import {
  ConnectionStatus,
  NotificationType,
  Role,
} from "../../../shared/Enums";
import {
  ErrorMessages,
  NotificationMessages,
  SuccessMessages,
} from "../../../shared/Messages";
import { ConversationMapper } from "../../conversation/mappers/ConversationMapper";
import {
  BadRequestError,
  NotFoundError,
  UnautharizedError,
} from "../../errors";
import { ANotificationMapper } from "../../notification/mappers/ANotificationMapper";
import { IDoctorAcceptConnectionRequestUseCase } from "../interfaces/IDoctorAcceptConnectionRequestUseCase";

export class DoctorAcceptConnectionRequestUseCase
  implements IDoctorAcceptConnectionRequestUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository,
    private _notificationRepository: INotificationRepository,
    private _conversationRepository: IConversationRepository,
    private _storageService: IStorageService,
    private _notificationEventPublisher: INotificationEventPublisher
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
    const connection = await this._connectionRepository.findByDoctorAndRep(
      doctorId,
      repId
    );
    if (!connection || connection.status !== ConnectionStatus.PENDING) {
      throw new BadRequestError(ErrorMessages.NO_PENDING_REQ);
    }
    await this._connectionRepository.updateStatus(
      doctorId,
      repId,
      ConnectionStatus.ACCEPTED
    );
    const notificationId =
      await this._notificationRepository.findNotificationOfConnectionByIds(
        repUserId,
        userId
      );
    if (notificationId) {
      await this._notificationRepository.updateNotificationById(
        notificationId,
        NotificationType.CONNECTION_ACCEPTED
      );
    }
    const notification = await this._notificationRepository.createNotification(
      userId,
      Role.DOCTOR,
      repUserId,
      Role.MEDICAL_REP,
      NotificationType.CONNECTION_ACCEPTED,
      NotificationMessages.CONNECTION_ACCEPT_MESSAGE
    );
    const notificationWithUser =
      await this._notificationRepository.findNotificationById(notification.id);
    if (!notificationWithUser)
      throw new NotFoundError(ErrorMessages.NOTIFICATION_NOT_FOUND);
    const mappedNotification = await ANotificationMapper.toDomain(
      notificationWithUser,
      this._storageService
    );

    await this._notificationEventPublisher.publishNotification({
      ...mappedNotification,
      receiverUserId: repUserId,
    });
    const unreadCount =
      await this._notificationRepository.getCountOfUnreadNotification(
        repUserId
      );
    await this._notificationEventPublisher.unreadNotificationCount({
      receiverUserId: repUserId,
      count: unreadCount,
    });
    let conversation = await this._conversationRepository.findByUsers(
      repUserId,
      userId
    );
    if (!conversation) {
      const mappedConversationData = ConversationMapper.toEntity(
        repId,
        doctorId
      );
      await this._conversationRepository.createConversation(
        mappedConversationData
      );
    }
    return SuccessMessages.CONNECTED;
  }
}
