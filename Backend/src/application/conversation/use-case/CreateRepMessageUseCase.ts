import { IMessageRepository } from "../../../domain/chat/respositories/IMessageRepository";
import { BadRequestError } from "../../../domain/common/errors";
import { IChatEventPublisher } from "../../../domain/common/services/IChatEventPublisher";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { UnautharizedError } from "../../errors";
import { CreateMessageDTO } from "../dto/CreateMessageDTO";
import { MessageResponseDTO } from "../dto/MessageDTO";
import { ICreateRepMessageUseCase } from "../interfaces/ICreateRepMessage";
import { MessageMapper } from "../mappers/MessageMapper";

export class CreateRepMessageUseCase implements ICreateRepMessageUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _messageRepository: IMessageRepository,
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
    const savedMessage = await this._messageRepository.createMessage(mappedMessage);
    const response = MessageMapper.toDomain(savedMessage);

    await this._chatEventPublisher.publishNewMessage(
      data.conversationId,
      response
    );

    return response;
  }
}