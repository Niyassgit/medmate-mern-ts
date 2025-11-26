import { MessageResponseDTO } from "../../../application/conversation/dto/MessageResponseDTO";

export interface IChatEventPublisher {
  publishNewMessage(
    conversationId: string,
    message: MessageResponseDTO
  ): Promise<void>;
}