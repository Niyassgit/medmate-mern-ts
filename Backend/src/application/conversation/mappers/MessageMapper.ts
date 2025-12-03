import { IMessage } from "../../../domain/chat/entities/IMessage";
import { ConversationUpdateDTO } from "../dto/ConversationUpdateDTO";
import { CreateMessageDTO } from "../dto/CreateMessageDTO";
import { MessageDTO } from "../dto/MessageDTO";

export class MessageMapper {
  static toDomain(entity: IMessage): MessageDTO {
    return {
      id: entity.id,
      content: entity.content,
      conversationId: entity.conversationId,
      createdAt: entity.createdAt,
      isRead: entity.isRead,
      messageType: entity.messageType,
      senderId: entity.senderId,
      senderRole: entity.senderRole,
    };
  }

  static toDomainList(entity: IMessage[]): MessageDTO[] {
    return entity.map((e) => this.toDomain(e));
  }
  static toEntity(
    dto: CreateMessageDTO,
    senderId: string
  ): Omit<IMessage, "id" | "createdAt" | "isRead"> {
    return {
      content: dto.content,
      conversationId: dto.conversationId,
      messageType: dto.messageType,
      senderId: senderId,
      senderRole: dto.senderRole,
    };
  }

  static conversationUpdate(message: MessageDTO): ConversationUpdateDTO {
    return {
      conversationId: message.conversationId,
      lastMessage: message.content ?? "",
      lastMessageAt: new Date(),
      senderRole: message.senderRole,
    };
  }
}
