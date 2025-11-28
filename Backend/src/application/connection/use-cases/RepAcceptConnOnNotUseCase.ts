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
import { IRepAcceptConnOnNotUseCase } from "../interfaces/IRepAcceptConnOnNotUseCase";

export class RepAcceptConnOnNotUseCase implements IRepAcceptConnOnNotUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _connectionRepository: IConnectionRepository,
    private _notificationRepository: INotificationRepository,
    private _conversationRepository: IConversationRepository,
    private _doctorRepository: IDoctorRepository,
    private _storageService:IStorageService,
    private _notificationEventPublisher:INotificationEventPublisher
  ) {}

  async execute(
    doctorId: string,
    notificationId: string,
    userId?: string
  ): Promise<string> {
    if (!userId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);

    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const { doctorUserId } = await this._doctorRepository.getUserIdByDoctorId(
      doctorId
    );
    if (!doctorUserId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
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
    const mappedConversationData = ConversationMapper.toEntity(repId, doctorId);
    await this._conversationRepository.createConversation(
      mappedConversationData
    );

    return SuccessMessages.CONNECTED;
  }
}
