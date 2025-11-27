import { MessageResponseDTO } from "../../../application/conversation/dto/MessageResponseDTO";
import { ConversationUpdateDTO } from "../../../application/conversation/dto/ConversationUpdateDTO";
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

  async publishConversationUpdate(
    doctorUserId: string | null,
    repUserId: string | null,
    update: ConversationUpdateDTO
  ): Promise<void> {
    io.to(`conversation:${update.conversationId}`).emit("conversation_update", update);
    
    if (doctorUserId) {
      io.to(`user:${doctorUserId}`).emit("conversation_update", update);
    }
    if (repUserId) {
      io.to(`user:${repUserId}`).emit("conversation_update", update);
    }
  }
}