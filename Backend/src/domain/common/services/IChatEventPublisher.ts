import { MessageResponseDTO } from "../../../application/conversation/dto/MessageResponseDTO";
import { ConversationUpdateDTO } from "../../../application/conversation/dto/ConversationUpdateDTO";

export interface IChatEventPublisher {
  publishNewMessage(
    conversationId: string,
    message: MessageResponseDTO
  ): Promise<void>;
  publishConversationUpdate(
    doctorUserId: string | null,
    repUserId: string | null,
    update: ConversationUpdateDTO
  ): Promise<void>;
}