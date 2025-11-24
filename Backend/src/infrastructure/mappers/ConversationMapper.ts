import { Conversation, Prisma } from "@prisma/client";
import { IConversation } from "../../domain/chat/entities/IConversation";

export class ConversationMapper {
  static toEntity(p: Conversation): IConversation {
    return {
      id: p.id,
      doctorId: p.doctorId,
      repId: p.repId,
      createdAt: p.createdAt,
      lastMessageAt: p.lastMessageAt,
    };
  }
  static toPersistance(entity:Omit<IConversation, "id" | "createdAt">):Prisma.ConversationCreateInput{
    return {
        doctor:{connect:{id:entity.doctorId}},
        rep:{connect:{id:entity.repId}},
        lastMessageAt:entity.lastMessageAt,
    }
  }
}
