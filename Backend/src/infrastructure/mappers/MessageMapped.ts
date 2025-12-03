import { Message, Prisma } from "@prisma/client";
import { IMessage } from "../../domain/chat/entities/IMessage";
import { MessageType, Role } from "../../shared/Enums";

export class MessageMapper {
  static toDomain(p: Message): IMessage {
    return {
      id: p.id,
      content: p.content,
      conversationId: p.conversationId,
      createdAt: p.createdAt,
      isRead: p.isRead,
      messageType: p.messageType as MessageType,
      senderId: p.senderId,
      senderRole: p.senderRole as Role,
    };
  }
  static toList(p: Message[]): IMessage[] {
    return p.map((m) => this.toDomain(m));
  }

  static toPersistance(
    m: Omit<IMessage, "id" | "createdAt" | "isRead">
  ): Prisma.MessageCreateInput {
    return {
      content: m.content,
      messageType: m.messageType,
      senderId: m.senderId,
      senderRole: m.senderRole,
      conversation: { connect: { id: m.conversationId } },
    };
  }
}
