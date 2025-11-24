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
import {
  BadRequestError,
  NotFoundError,
  UnautharizedError,
} from "../../errors";
import { IDoctorAcceptConnectionRequestUseCase } from "../interfaces/IDoctorAcceptConnectionRequestUseCase";

export class DoctorAcceptConnectionRequestUseCase
  implements IDoctorAcceptConnectionRequestUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository,
    private _notificationRepository: INotificationRepository,
    private _conversationRepository: IConversationRepository
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
