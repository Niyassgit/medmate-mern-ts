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
import { BadRequestError, NotFoundError } from "../../errors";
import { ANotificationMapper } from "../../notification/mappers/ANotificationMapper";
import { IRepAcceptConnectionRequestUseCase } from "../interfaces/IRepAcceptConnectionRequestUseCase";

export class RepAcceptingConnectionRequest
  implements IRepAcceptConnectionRequestUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository,
    private _notificationRepository: INotificationRepository,
    private _conversationRepository: IConversationRepository,
    private _notificationEventPublisher: INotificationEventPublisher,
    private _storageService: IStorageService
  ) {}
  async execute(doctorId: string, userId?: string): Promise<string> {
    if (!userId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const { doctorUserId } = await this._doctorRepository.getUserIdByDoctorId(
      doctorId
    );
    if (!doctorUserId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
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
        doctorId,
        repId
      );
    if (notificationId) {
      await this._notificationRepository.updateNotificationById(
        notificationId,
        NotificationType.CONNECTION_ACCEPTED
      );
    }
    const notification = await this._notificationRepository.createNotification(
      userId,
      Role.MEDICAL_REP,
      doctorUserId,
      Role.DOCTOR,
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
    const conversation = await this._conversationRepository.findByUsers(
      userId,
      doctorUserId
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
