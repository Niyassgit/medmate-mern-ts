import { Role } from "@prisma/client";

export interface ConversationUpdateDTO{
       conversationId: string;
      lastMessage: string | null;
      lastMessageAt: Date,
      senderRole: Role
}