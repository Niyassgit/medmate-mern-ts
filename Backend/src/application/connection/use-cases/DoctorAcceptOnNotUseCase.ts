import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import {
  BadRequestError,
  NotFoundError,
  UnautharizedError,
} from "../../errors";
import { IDoctorAcceptOnNotUseCase } from "../interfaces/IDoctorAcceptOnNotUseCase";
import { ConnectionStatus, NotificationType } from "../../../shared/Enums";
import { IConversationRepository } from "../../../domain/chat/respositories/IConversationRepository";
import { ConversationMapper } from "../../conversation/mappers/ConversationMapper";

export class DoctorAcceptOnNotUseCase implements IDoctorAcceptOnNotUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _notificationRepository: INotificationRepository,
    private _connectionRepository: IConnectionRepository,
    private _conversationRepository: IConversationRepository
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
    const mappedConversationData = ConversationMapper.toEntity(repId, doctorId);
    await this._conversationRepository.createConversation(
      mappedConversationData
    );
    return SuccessMessages.CONNECTED;
  }
}
