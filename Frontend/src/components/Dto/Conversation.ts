export interface Conversation {
  id: string;
  name: string;
  profilImage: string;
  lastMessage: string | null;
  lastMessageAt: string;
  unread: number;
}
