import { Message, Prisma } from "@prisma/client";
import { IMessage } from "../../domain/chat/entities/IMessage";
import { IMessageRepository } from "../../domain/chat/respositories/IMessageRepository";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../database/prisma";
import { MessageMapper } from "../mappers/MessageMapped";

export class MessageRepository
  extends BaseRepository<
    IMessage,
    Message,
    Prisma.MessageCreateInput,
    "message"
  >
  implements IMessageRepository
{
  constructor() {
    super(prisma.message, (M) => MessageMapper.toDomain(M));
  }
  async getMessages(conversationId: string): Promise<IMessage[]> {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return MessageMapper.toList(messages);
  }
  async createMessage(
    message: Omit<IMessage, "id" | "createdAt" | "isRead">
  ): Promise<IMessage> {
    const mappedMessage = MessageMapper.toPersistance(message);
    return this.create(mappedMessage);
  }

  async markAsRead(conversationId: string, profileId: string): Promise<void> {
    await prisma.message.updateMany({
      where: { conversationId, senderId: { not: profileId }, isRead: false },
      data: { isRead: true },
    });
  }
}
