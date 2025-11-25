import { MessageType, Role } from "../../../shared/Enums";

export interface MessageResponseDTO {
  id: string;
  conversationId: string;
  content: string | null;
  messageType: MessageType;
  senderId: string;
  senderRole: Role;
  isRead: boolean;
  createdAt: Date;
}
