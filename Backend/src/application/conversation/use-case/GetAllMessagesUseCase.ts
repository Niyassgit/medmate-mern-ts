import { IMessageRepository } from "../../../domain/chat/respositories/IMessageRepository";
import { ChatResponseDTO } from "../dto/ChatResponseDTO";
import { IGetAllMessagesUseCase } from "../interfaces/IGetAllMessagesUseCase";
import { MessageMapper } from "../mappers/MessageMapper";

export class GetAllMessagesUseCase implements IGetAllMessagesUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
  ) {}
  async execute(conversationId: string,cursor?:string): Promise<ChatResponseDTO> {
    const messages = await this._messageRepository.getMessages(
      conversationId,
      cursor
    );
    return{
      messages:MessageMapper.toDomainList(messages),
      nextCursor:messages.length>0 ?messages[messages.length-1].id:null
    } ;
  }
}
