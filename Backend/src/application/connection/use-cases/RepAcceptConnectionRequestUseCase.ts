import { IConversationRepository } from "../../../domain/chat/respositories/IConversationRepository";
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
import { IRepAcceptConnectionRequestUseCase } from "../interfaces/IRepAcceptConnectionRequestUseCase";

export class RepAcceptingConnectionRequest
  implements IRepAcceptConnectionRequestUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository,
    private _notificationRepository: INotificationRepository,
    private _conversationRepository: IConversationRepository
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
