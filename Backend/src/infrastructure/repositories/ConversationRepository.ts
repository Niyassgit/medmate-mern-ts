import { Conversation, Prisma } from "@prisma/client";
import { IConversation } from "../../domain/chat/entities/IConversation";
import { IConversationRepository } from "../../domain/chat/respositories/IConversationRepository";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../database/prisma";
import { ConversationMapper } from "../mappers/ConversationMapper";
import { IUserConversation } from "../../domain/chat/entities/IUserConversation";

export class ConversationRepository
  extends BaseRepository<
    IConversation,
    Conversation,
    Prisma.ConversationCreateInput,
    "conversation"
  >
  implements IConversationRepository
{
  constructor() {
    super(prisma.conversation, (conv) => ConversationMapper.toEntity(conv));
  }

  async createConversation(
    data: Omit<IConversation, "id" | "createdAt">
  ): Promise<IConversation> {
    const mappedData = ConversationMapper.toPersistance(data);
    return this.create(mappedData);
  }

  async findUserConversations(
    profileId: string,
  ): Promise<IUserConversation[]> {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ doctorId: profileId }, { repId: profileId }],
      },
      include: {
        doctor: { include: { user: true } },
        rep: { include: { user: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    const unreadGroups = await prisma.message.groupBy({
      by: ["conversationId"],
      where: {
        conversationId: { in: conversations.map((c) => c.id) },
        senderId: { not: profileId },
        isRead: false,
      },
      _count: { conversationId: true },
    });

    const unreadMap = new Map(
      unreadGroups.map((u) => [u.conversationId, u._count.conversationId])
    );

    const result: IUserConversation[] = [];

    for (let conv of conversations) {
      const isDoctor = conv.doctorId === profileId;
      const other = isDoctor ? conv.rep : conv.doctor;
      const latest = conv.messages[0];

      const lastMessageSentByCurrentUser = latest?.senderId === profileId;
      const lastMessageIsRead = lastMessageSentByCurrentUser 
        ? (latest?.isRead ?? false)
        : false;

      result.push({
        id: conv.id,
        name: other.name,
        profileImage: other.user?.profileImage ?? null,
        lastMessage: latest?.content ?? "No messages yet",
        lastMessageAt: latest?.createdAt ?? conv.createdAt,
        unread: unreadMap.get(conv.id) ?? 0,
        doctorId: conv.doctorId,
        repId: conv.repId,
        repUserId: conv.rep?.user?.id ?? null,
        doctorUserId: conv.doctor?.user?.id ?? null,
        lastMessageIsRead: lastMessageIsRead,
        senderId: latest?.senderId ?? ""
      });
    }

    return result;
  }

  async findByUsers(
    repId: string,
    doctorId: string
  ): Promise<IConversation | null> {
    const result = await prisma.conversation.findFirst({
      where: { doctorId: doctorId, repId: repId },
    });
    if (!result) return null;
    return ConversationMapper.toEntity(result);
  }

  async findConversationById(
    conversationId: string
  ): Promise<IConversation | null> {
    return await this.findById(conversationId);
  }
}
