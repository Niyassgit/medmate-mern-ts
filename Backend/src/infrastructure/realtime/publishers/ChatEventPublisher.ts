import { MessageResponseDTO } from "../../../application/conversation/dto/MessageResponseDTO";
import { IChatEventPublisher } from "../../../domain/common/services/IChatEventPublisher";
import { io } from "../SocketGateway";

export class ChatEventPublisher implements IChatEventPublisher {
  async publishNewMessage(
    conversationId: string,
    message: MessageResponseDTO
  ): Promise<void> {
    const room = `conversation:${conversationId}`;
    io.to(room).emit("new_message", message);
  }
}