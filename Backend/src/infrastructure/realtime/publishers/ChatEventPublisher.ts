import { MessageDTO } from "../../../application/conversation/dto/MessageDTO";
import { IChatEventPublisher } from "../../../domain/common/services/IChatEventPublisher";
import { io } from "../SocketGateway";

export class ChatEventPublisher implements IChatEventPublisher {
  async publishNewMessage(
    conversationId: string,
    message: MessageDTO
  ): Promise<void> {
    const room = `conversation:${conversationId}`;
    io.to(room).emit("new_message", message);
  }

  async updateChatAsSeen(conversationId: string): Promise<void> {
    const room=`conversation:${conversationId}`;
    io.to(room).emit("message_seen",conversationId);
  }
}
