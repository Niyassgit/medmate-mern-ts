import { MessageType } from "@/types/MessageTypes";
import { Role } from "@/types/Role";

export interface MessageDTO {
  id: string;
  conversationId: string;
  content: string | null;
  messageType: MessageType;
  senderId: string;
  senderRole: Role;
  isRead: boolean;
  createdAt: Date;
}
