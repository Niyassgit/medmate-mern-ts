import { IConversation } from "../entities/IConversation";
import { IUserConversation } from "../entities/IUserConversation";

export interface IConversationRepository {
  createConversation(data:Omit<IConversation, "id" | "createdAt">): Promise<IConversation>;
  findByUsers(repId: string, doctorId: string): Promise<IConversation | null>;
  findConversationById(conversationId: string): Promise<IConversation | null>;
  findUserConversations(profileId: string): Promise<IUserConversation[]>;
  updateLastMessageTime(conversationId: string): Promise<void>;
}
