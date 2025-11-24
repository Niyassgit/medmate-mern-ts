export interface IUserConversation {
  id: string;
  name: string;
  profileImage: string | null;
  lastMessage?: string;
  lastMessageAt?: Date;
  unread: number;
}
