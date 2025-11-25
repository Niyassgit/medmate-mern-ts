import { IMessageRepository } from "../../../domain/chat/respositories/IMessageRepository";
import { MessageResponseDTO } from "../dto/MessageResponseDTO";
import { IGetAllMessagesUseCase } from "../interfaces/IGetAllMessagesUseCase";
import { MessageMapper } from "../mappers/MessageMapper";

export class GetAllMessagesUseCase implements IGetAllMessagesUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
  ) {}
  async execute(conversationId: string): Promise<MessageResponseDTO[]> {
    const messages = await this._messageRepository.getMessages(
      conversationId
    );
    return MessageMapper.toDomainList(messages);
  }
}
