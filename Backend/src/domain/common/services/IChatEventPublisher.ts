import { IMessage } from "../../chat/entities/IMessage";

export interface IChatEventPublisher {
  publishNewMessage(
    conversationId: string,
    message: IMessage
  ): Promise<void>;
  updateChatAsSeen(
    conversationId:string
  ):Promise<void>;
}