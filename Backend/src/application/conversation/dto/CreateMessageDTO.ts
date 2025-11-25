import { MessageType, Role } from "../../../shared/Enums";

export interface CreateMessageDTO {
  conversationId: string;
  content: string | null;
  messageType: MessageType;
  senderId: string;
  senderRole: Role;
  receiverId: string;
}
