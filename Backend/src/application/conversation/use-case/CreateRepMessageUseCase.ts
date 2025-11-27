import { IConversationRepository } from "../../../domain/chat/respositories/IConversationRepository";
import { IMessageRepository } from "../../../domain/chat/respositories/IMessageRepository";
import { BadRequestError } from "../../../domain/common/errors";
import { IChatEventPublisher } from "../../../domain/common/services/IChatEventPublisher";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { UnautharizedError } from "../../errors";
import { CreateMessageDTO } from "../dto/CreateMessageDTO";
import { ConversationUpdateDTO } from "../dto/ConversationUpdateDTO";
import { MessageResponseDTO } from "../dto/MessageResponseDTO";
import { ICreateRepMessageUseCase } from "../interfaces/ICreateRepMessage";
import { MessageMapper } from "../mappers/MessageMapper";

export class CreateRepMessageUseCase implements ICreateRepMessageUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _messageRepository: IMessageRepository,
    private _conversationRepository: IConversationRepository,
    private _doctorRepository: IDoctorRepository,
    private _chatEventPublisher: IChatEventPublisher
  ) {}

  async execute(
    data: CreateMessageDTO,
    userId?: string
  ): Promise<MessageResponseDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

    const mappedMessage = MessageMapper.toEntity(data, repId);
    const savedMessage = await this._messageRepository.createMessage(
      mappedMessage
    );
    const response = MessageMapper.toDomain(savedMessage);

    await this._conversationRepository.updateLastMessageTime(
      data.conversationId
    );

    const conversation =
      await this._conversationRepository.findConversationById(
        data.conversationId
      );
    if (conversation) {
      const { doctorUserId } = await this._doctorRepository.getUserIdByDoctorId(
        conversation.doctorId
      );
      const { repUserId } = await this._medicalRepRepository.getUserIdByRepId(
        conversation.repId
      );

      const conversationUpdate = MessageMapper.conversationUpdate(response);
      await this._chatEventPublisher.publishConversationUpdate(
        doctorUserId,
        repUserId,
        conversationUpdate
      );
    }

    await this._chatEventPublisher.publishNewMessage(
      data.conversationId,
      response
    );

    return response;
  }
}
