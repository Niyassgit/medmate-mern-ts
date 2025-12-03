import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import {
  ErrorMessages,
  NotificationMessages,
  SuccessMessages,
} from "../../../shared/Messages";
import {
  BadRequestError,
  NotFoundError,
  UnautharizedError,
} from "../../errors";
import { IDoctorAcceptOnNotUseCase } from "../interfaces/IDoctorAcceptOnNotUseCase";
import {
  ConnectionStatus,
  NotificationType,
  Role,
} from "../../../shared/Enums";
import { IConversationRepository } from "../../../domain/chat/respositories/IConversationRepository";
import { ConversationMapper } from "../../conversation/mappers/ConversationMapper";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ANotificationMapper } from "../../notification/mappers/ANotificationMapper";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { INotificationEventPublisher } from "../../../domain/common/services/INotificationEventPublisher";

export class DoctorAcceptOnNotUseCase implements IDoctorAcceptOnNotUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _notificationRepository: INotificationRepository,
    private _connectionRepository: IConnectionRepository,
    private _conversationRepository: IConversationRepository,
    private _medicalRepRepository: IMedicalRepRepository,
    private _storageService: IStorageService,
    private _notificationEventPublisher: INotificationEventPublisher
  ) {}
  async execute(
    repId: string,
    notificationId: string,
    userId?: string
  ): Promise<string> {
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
    const mappedConversationData = ConversationMapper.toEntity(repId, doctorId);
    await this._conversationRepository.createConversation(
      mappedConversationData
    );
    return SuccessMessages.CONNECTED;
  }
}
