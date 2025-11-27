import { Role } from "../../../shared/Enums";

export interface ConversationUpdateDTO {
  conversationId: string;
  lastMessage: string;
  lastMessageAt: Date;
  senderRole?: Role;
  unread?: number;
}

